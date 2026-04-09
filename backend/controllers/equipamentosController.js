// =============================================
// CONTROLLER DE EQUIPAMENTOS
// =============================================
const db = require('../config/database');

const STATUS_VALIDOS = ['operacional', 'em_manutencao', 'desativado'];

// GET /equipamentos - lista todos os equipamentos do inventário
const listar = async (req, res) => {
  try {
    const [equipamentos] = await db.query('SELECT * FROM equipamentos ORDER BY id');
    return res.json(equipamentos);
  } catch (erro) {
    console.error('listar equipamentos error:', erro);
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

// GET /equipamentos/:id - retorna um equipamento pelo ID
const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [equipamentos] = await db.query('SELECT * FROM equipamentos WHERE id = ?', [id]);

    if (equipamentos.length === 0) {
      return res.status(404).json({ mensagem: 'Equipamento não encontrado.' });
    }

    return res.json(equipamentos[0]);
  } catch (erro) {
    console.error('buscarPorId equipamento error:', erro);
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

// POST /equipamentos - cria um novo equipamento (apenas admin)
const criar = async (req, res) => {
  try {
    const { nome, categoria, patrimonio, status, descricao } = req.body;

    if (!nome || !patrimonio) {
      return res.status(400).json({ mensagem: 'nome e patrimonio são obrigatórios.' });
    }

    const situacao = status && STATUS_VALIDOS.includes(status) ? status : 'operacional';

    const [resultado] = await db.query(
      'INSERT INTO equipamentos (nome, categoria, patrimonio, status, descricao) VALUES (?, ?, ?, ?, ?)',
      [nome, categoria || null, patrimonio, situacao, descricao || null]
    );

    return res.status(201).json({
      mensagem: 'Equipamento criado com sucesso.',
      equipamento: {
        id: resultado.insertId,
        nome,
        categoria: categoria || null,
        patrimonio,
        status: situacao,
        descricao: descricao || null,
      },
    });
  } catch (erro) {
    console.error('criar equipamento error:', erro);
    if (erro.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ mensagem: 'Patrimônio já cadastrado.' });
    }
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

// PUT /equipamentos/:id - atualiza um equipamento (apenas admin)
const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, categoria, patrimonio, status, descricao } = req.body;

    const [equipamentos] = await db.query('SELECT * FROM equipamentos WHERE id = ?', [id]);
    if (equipamentos.length === 0) {
      return res.status(404).json({ mensagem: 'Equipamento não encontrado.' });
    }

    const equipamentoExistente = equipamentos[0];
    const situacao = status && STATUS_VALIDOS.includes(status) ? status : equipamentoExistente.status;

    const [resultado] = await db.query(
      'UPDATE equipamentos SET nome = ?, categoria = ?, patrimonio = ?, status = ?, descricao = ? WHERE id = ?',
      [
        nome ?? equipamentoExistente.nome,
        categoria ?? equipamentoExistente.categoria,
        patrimonio ?? equipamentoExistente.patrimonio,
        situacao,
        descricao ?? equipamentoExistente.descricao,
        id,
      ]
    );

    return res.json({ mensagem: 'Equipamento atualizado com sucesso.' });
  } catch (erro) {
    console.error('atualizar equipamento error:', erro);
    if (erro.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ mensagem: 'Patrimônio já cadastrado.' });
    }
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

// DELETE /equipamentos/:id - remove um equipamento (apenas admin)
const remover = async (req, res) => {
  try {
    const { id } = req.params;
    const [resultado] = await db.query('DELETE FROM equipamentos WHERE id = ?', [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Equipamento não encontrado.' });
    }

    return res.json({ mensagem: 'Equipamento removido com sucesso.' });
  } catch (erro) {
    console.error('remover equipamento error:', erro);
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

module.exports = { listar, buscarPorId, criar, atualizar, remover };
