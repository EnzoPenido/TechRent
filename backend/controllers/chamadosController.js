// =============================================
// CONTROLLER DE CHAMADOS
// =============================================
const db = require('../config/database');

const STATUS_VALIDOS = ['aberto', 'em_atendimento', 'resolvido', 'cancelado'];
const PRIORIDADES_VALIDAS = ['baixa', 'media', 'alta'];

const camposComuns =
  'c.id, c.titulo, c.descricao, c.cliente_id, c.equipamento_id, c.tecnico_id, c.prioridade, c.status, c.aberto_em, c.atualizado_em, u_cliente.nome AS cliente_nome, e.nome AS equipamento_nome, u_tec.nome AS tecnico_nome';

const montarFiltroUsuario = (nivelAcesso, usuarioId) => {
  if (nivelAcesso === 'cliente') {
    return {
      sql: 'WHERE c.cliente_id = ?',
      params: [usuarioId],
    };
  }
  return { sql: '', params: [] };
};

// GET /chamados - lista chamados
//   admin/técnico -> todos os chamados
//   cliente       -> apenas os seus (WHERE cliente_id = req.usuario.id)
const listar = async (req, res) => {
  try {
    const { sql, params } = montarFiltroUsuario(req.usuario.nivel_acesso, req.usuario.id);
    const query = `SELECT ${camposComuns} FROM chamados c JOIN usuarios u_cliente ON c.cliente_id = u_cliente.id JOIN equipamentos e ON c.equipamento_id = e.id LEFT JOIN usuarios u_tec ON c.tecnico_id = u_tec.id ${sql} ORDER BY c.aberto_em DESC`;
    const [chamados] = await db.query(query, params);
    return res.json(chamados);
  } catch (erro) {
    console.error('listar chamados error:', erro);
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

// GET /chamados/:id - retorna um chamado pelo ID
const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [chamados] = await db.query(
      `SELECT ${camposComuns} FROM chamados c JOIN usuarios u_cliente ON c.cliente_id = u_cliente.id JOIN equipamentos e ON c.equipamento_id = e.id LEFT JOIN usuarios u_tec ON c.tecnico_id = u_tec.id WHERE c.id = ?`,
      [id]
    );

    if (chamados.length === 0) {
      return res.status(404).json({ mensagem: 'Chamado não encontrado.' });
    }

    const chamado = chamados[0];
    if (req.usuario.nivel_acesso === 'cliente' && chamado.cliente_id !== req.usuario.id) {
      return res.status(403).json({ mensagem: 'Acesso negado a este chamado.' });
    }

    return res.json(chamado);
  } catch (erro) {
    console.error('buscarPorId chamado error:', erro);
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

// POST /chamados - abre um novo chamado (cliente/admin)
// Body esperado: { titulo, descricao, equipamento_id, prioridade }
const criar = async (req, res) => {
  const conexao = await db.getConnection();
  try {
    const { titulo, descricao, equipamento_id, prioridade } = req.body;

    if (!titulo || !equipamento_id) {
      return res.status(400).json({ mensagem: 'titulo e equipamento_id são obrigatórios.' });
    }

    const prioridadeValida = PRIORIDADES_VALIDAS.includes(prioridade) ? prioridade : 'media';

    await conexao.beginTransaction();

    const [equipamentos] = await conexao.query(
      'SELECT status FROM equipamentos WHERE id = ? FOR UPDATE',
      [equipamento_id]
    );

    if (equipamentos.length === 0) {
      await conexao.rollback();
      return res.status(404).json({ mensagem: 'Equipamento não encontrado.' });
    }

    if (equipamentos[0].status !== 'operacional') {
      await conexao.rollback();
      return res.status(400).json({ mensagem: 'Equipamento não está disponível para abertura de chamado.' });
    }

    const [resultado] = await conexao.query(
      'INSERT INTO chamados (titulo, descricao, cliente_id, equipamento_id, prioridade) VALUES (?, ?, ?, ?, ?)',
      [titulo, descricao || null, req.usuario.id, equipamento_id, prioridadeValida]
    );

    await conexao.query(
      "UPDATE equipamentos SET status = 'em_manutencao' WHERE id = ?",
      [equipamento_id]
    );

    await conexao.commit();

    return res.status(201).json({
      mensagem: 'Chamado criado com sucesso.',
      chamado: {
        id: resultado.insertId,
        titulo,
        descricao: descricao || null,
        cliente_id: req.usuario.id,
        equipamento_id,
        prioridade: prioridadeValida,
        status: 'aberto',
      },
    });
  } catch (erro) {
    await conexao.rollback();
    console.error('criar chamado error:', erro);
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  } finally {
    conexao.release();
  }
};

// PUT /chamados/:id/status - atualiza o status do chamado (técnico/admin)
// Body esperado: { status, tecnico_id (opcional) }
const atualizarStatus = async (req, res) => {
  const conexao = await db.getConnection();
  try {
    const { id } = req.params;
    const { status, tecnico_id: tecnicoIdBody } = req.body;

    if (!status || !STATUS_VALIDOS.includes(status)) {
      return res.status(400).json({ mensagem: 'status inválido ou obrigatório.' });
    }

    await conexao.beginTransaction();

    const [chamados] = await conexao.query(
      'SELECT * FROM chamados WHERE id = ? FOR UPDATE',
      [id]
    );

    if (chamados.length === 0) {
      await conexao.rollback();
      return res.status(404).json({ mensagem: 'Chamado não encontrado.' });
    }

    const chamado = chamados[0];
    if (['resolvido', 'cancelado'].includes(chamado.status)) {
      await conexao.rollback();
      return res.status(400).json({ mensagem: 'Chamado já finalizado e não pode ser atualizado.' });
    }

    const transicoes = {
      aberto: ['em_atendimento', 'cancelado'],
      em_atendimento: ['resolvido', 'cancelado'],
    };

    if (!transicoes[chamado.status] || !transicoes[chamado.status].includes(status)) {
      await conexao.rollback();
      return res.status(400).json({ mensagem: `Transição de status inválida de ${chamado.status} para ${status}.` });
    }

    let tecnicoId = chamado.tecnico_id;
    if (status === 'em_atendimento') {
      if (tecnicoId == null) {
        tecnicoId = req.usuario.nivel_acesso === 'tecnico' ? req.usuario.id : tecnicoId;
      }
      if (tecnicoIdBody) {
        const [usuarios] = await conexao.query('SELECT nivel_acesso FROM usuarios WHERE id = ?', [tecnicoIdBody]);
        if (usuarios.length === 0 || usuarios[0].nivel_acesso !== 'tecnico') {
          await conexao.rollback();
          return res.status(400).json({ mensagem: 'tecnico_id inválido.' });
        }
        tecnicoId = tecnicoIdBody;
      }
      if (tecnicoId == null) {
        await conexao.rollback();
        return res.status(400).json({ mensagem: 'tecnico_id obrigatório para iniciar atendimento.' });
      }
    }

    if (status === 'resolvido') {
      tecnicoId = req.usuario.nivel_acesso === 'tecnico' ? req.usuario.id : tecnicoId;
    }

    const equipamentoStatus = status === 'em_atendimento' ? 'em_manutencao' : 'operacional';

    await conexao.query(
      'UPDATE chamados SET status = ?, tecnico_id = ? WHERE id = ?',
      [status, tecnicoId, id]
    );

    await conexao.query(
      'UPDATE equipamentos SET status = ? WHERE id = ?',
      [equipamentoStatus, chamado.equipamento_id]
    );

    await conexao.commit();

    return res.json({ mensagem: 'Status do chamado atualizado com sucesso.' });
  } catch (erro) {
    await conexao.rollback();
    console.error('atualizarStatus chamado error:', erro);
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  } finally {
    conexao.release();
  }
};

module.exports = { listar, buscarPorId, criar, atualizarStatus };
