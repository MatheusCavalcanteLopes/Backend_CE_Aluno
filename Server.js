require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || 'secreto';

// Middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000' })); // Habilitar cookies no CORS
app.use(express.json());
app.use(cookieParser());

// Rota de login - Qualquer username e senha são aceitos
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username e senha são obrigatórios' });
    }

    // Criar token JWT
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

    // Enviar o token no cookie HttpOnly
    res.cookie('auth_token', token, { httpOnly: true, secure: false });
    res.json({ message: 'Login bem-sucedido!' });
});

// Middleware para verificar o token no Cookie
const verifyToken = (req, res, next) => {
    const token = req.cookies.auth_token;

    if (!token) return res.status(403).json({ error: 'Token não fornecido' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token inválido' });

        req.user = decoded;
        next();
    });
};

// Rota protegida usando o token no Cookie
app.get('/api/protected', verifyToken, (req, res) => {
    res.json({ message: `Bem-vindo, ${req.user.username}! Esta é uma rota protegida.` });
});

// Logout - Remove o token do cookie
app.post('/api/logout', (req, res) => {
    res.clearCookie('auth_token');
    res.json({ message: 'Logout realizado com sucesso' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
