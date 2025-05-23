import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: any) => void;
}

const Login = ({ setIsAuthenticated, setUser }: LoginProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      const response = await axios.post('http://localhost:3000/api/user/login-de-usuario', formData, {headers: {
  'Content-Type': 'application/json'
}});
      
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      setUser({ email: formData.email }); // Você pode expandir isso com mais dados do usuário
      
      navigate('/');
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErro(error.response.data.message);
      } else {
        setErro('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div>
          <div className="auth-logo">BlogArtgs</div>
          <div className="auth-subtitle">Expandindo seu conhecimento.</div>
        </div>
      </div>
      
      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Bem-vindo de volta!</h2>
          <p>Acesse sua conta para acompanhar artigos exclusivos, favoritar e muito mais.</p>
          
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={formData.senha}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="auth-link" style={{ textAlign: 'left', marginBottom: '20px' }}>
            <Link to="/esqueci-senha">Esqueceu a senha?</Link>
          </div>
          
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Login'}
          </button>
          
          {erro && <div className="error-message">{erro}</div>}
          
          <div className="auth-link">
            Novo usuário? <Link to="/registro">Crie sua conta</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;