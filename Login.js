import { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                'http://localhost:5000/api/login',
                { username, password },
                { withCredentials: true } // Permitir cookies
            );
            onLogin();
        } catch (err) {
            setError('Falha no login');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
};

export default Login;
