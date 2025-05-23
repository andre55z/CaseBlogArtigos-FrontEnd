import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nomeusuario: '',
    email: '',
    senha: '',
    confirmarSenha: ''
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

    // Validar senhas
    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (formData.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/user/registro-de-usuario', {
        nomeusuario: formData.nomeusuario,
        email: formData.email,
        senha: formData.senha
      }, {headers: {
  'Content-Type': 'application/json'
}});
      
      // Redirecionar para login após sucesso
      navigate('/login', { 
        state: { message: 'Conta criada com sucesso! Faça login para continuar.' }
      });
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErro(error.response.data.message);
      } else {
        setErro('Erro ao criar conta. Tente novamente.');
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div>
          <div className="auth-logo">M.</div>
          <div className="auth-subtitle">Conteúdo que inspira</div>
        </div>
      </div>
      
      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Registrar</h2>
          <p>Crie sua conta para ter acesso completo a todos os artigos. É totalmente grátis!</p>
          
          <div className="form-group">
            <input
              type="text"
              name="nomeusuario"
              placeholder="Nome de usuário"
              value={formData.nomeusuario}
              onChange={handleChange}
              required
            />
          </div>
          
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
              minLength={6}
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="confirmarSenha"
              placeholder="Confirmar senha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
          
          {erro && <div className="error-message">{erro}</div>}
          

          
          <div className="auth-link">
            Já tem cadastro? <Link to="/login">Entre aqui</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;