// =============================================
// CONTROLLER DE HISTÓRICO DE MANUTENÇÃO
// =============================================
const db = require('../config/database');

// GET /manutencao - lista todos os registros de manutenção (admin/técnico)
const listar = async (req, res) => {
  try {
    const [registros] = await db.query(
      `SELECT
         hm.id,
         hm.chamado_id,
         c.titulo AS chamado_titulo,
         hm.equipamento_id,
         e.nome AS equipamento,
         hm.tecnico_id,
         u.nome AS tecnico_nome,
         hm.descricao,
         hm.registrado_em
       FROM historico_manutencao hm
       JOIN chamados c ON hm.chamado_id = c.id
       JOIN equipamentos e ON hm.equipamento_id = e.id
       JOIN usuarios u ON hm.tecnico_id = u.id
       ORDER BY hm.registrado_em DESC`
    );

    return res.json(registros);
  } catch (erro) {
    console.error('listar manutencao error:', erro);
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

// POST /manutencao - registra um reparo em um equipamento (técnico)
// Body esperado: { chamado_id, equipamento_id, descricao }
// Após registrar, atualizar chamados.status para 'resolvido'
// e equipamentos.status para 'operacional'
const registrar = async (req, res) => {
  const conexao = await db.getConnection();
  try {
    const { chamado_id, descricao } = req.body;

    if (!chamado_id || !descricao) {
      return res.status(400).json({ mensagem: 'chamado_id e descricao são obrigatórios.' });
    }

    await conexao.beginTransaction();

    const [chamados] = await conexao.query(
      'SELECT * FROM chamados WHERE id = ? FOR UPDATE',
      [chamado_id]
    );

    if (chamados.length === 0) {
      await conexao.rollback();
      return res.status(404).json({ mensagem: 'Chamado não encontrado.' });
    }

    const chamado = chamados[0];
    if (['resolvido', 'cancelado'].includes(chamado.status)) {
      await conexao.rollback();
      return res.status(400).json({ mensagem: 'Chamado já finalizado e não pode receber nova manutenção.' });
    }

    await conexao.query(
      'INSERT INTO historico_manutencao (chamado_id, equipamento_id, tecnico_id, descricao) VALUES (?, ?, ?, ?)',
      [chamado_id, chamado.equipamento_id, req.usuario.id, descricao]
    );

    await conexao.query('UPDATE chamados SET status = ?, tecnico_id = ? WHERE id = ?', [
      'resolvido',
      req.usuario.id,
      chamado_id,
    ]);

    await conexao.query('UPDATE equipamentos SET status = ? WHERE id = ?', [
      'operacional',
      chamado.equipamento_id,
    ]);

    await conexao.commit();

    return res.status(201).json({ mensagem: 'Manutenção registrada com sucesso.' });
  } catch (erro) {
    await conexao.rollback();
    console.error('registrar manutencao error:', erro);
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  } finally {
    conexao.release();
  }
};

module.exports = { listar, registrar };
