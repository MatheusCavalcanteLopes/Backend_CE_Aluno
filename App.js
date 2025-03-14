import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import Dashboard from './Dashboard';

const App = () => { 
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Verifica se o usuário já está autenticado (token no cookie)
        const checkAuth = async () => {
            try {
                await axios.get('http://localhost:5000/api/protected', { withCredentials: true });
                setIsAuthenticated(true);
            } catch {
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    const handleLogout = async () => {
        await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
        setIsAuthenticated(false);
    };

    return (
        <div>
            {isAuthenticated ? <Dashboard /> : <Login onLogin={() => setIsAuthenticated(true)} />}
            {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
        </div>
    );
};

export default App;
