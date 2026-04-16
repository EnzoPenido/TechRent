// =============================================
// CONTROLLER DE AUTENTICAÇÃO
// =============================================
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const NIVEIS_VALIDOS = ['cliente', 'admin', 'tecnico'];

// POST /auth/registro - cria um novo usuário
const registro = async (req, res) => {
  try {
    const { nome, email, senha, nivel_acesso } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'nome, email e senha são obrigatórios.' });
    }

    const [usuariosExistentes] = await db.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (usuariosExistentes.length > 0) {
      return res.status(409).json({ mensagem: 'Email já cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const acesso = NIVEIS_VALIDOS.includes(nivel_acesso) ? nivel_acesso : 'cliente';

    const [resultado] = await db.query(
      'INSERT INTO usuarios (nome, email, senha, nivel_acesso) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, acesso]
    );

    return res.status(201).json({
      mensagem: 'Usuário criado com sucesso.',
      usuario: {
        id: resultado.insertId,
        nome,
        email,
        nivel_acesso: acesso,
      },
    });
  } catch (erro) {
    console.error('registro error:', erro.message);
    console.error('Error stack:', erro.stack);
    return res.status(500).json({ mensagem: 'Erro interno do servidor.', erro: erro.message });
  }
};

// POST /auth/login - autentica e retorna JWT
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    console.log('Login attempt with email:', email);

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'email e senha são obrigatórios.' });
    }

    console.log('Attempting to query database for user:', email);
    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    console.log('Database query result:', usuarios.length > 0 ? 'User found' : 'User not found');

    if (usuarios.length === 0) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
    }

    const usuario = usuarios[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
    }

    const payload = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      nivel_acesso: usuario.nivel_acesso,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '9h',
    });

    return res.json({ token, usuario: payload });
  } catch (erro) {
    console.error('login error:', erro.message);
    console.error('Error stack:', erro.stack);
    return res.status(500).json({ mensagem: 'Erro interno do servidor.', erro: erro.message });
  }
};

module.exports = { registro, login };
