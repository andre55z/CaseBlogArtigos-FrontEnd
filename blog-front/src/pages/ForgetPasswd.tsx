import React, {useState} from 'react';
import { useNavigate} from 'react-router-dom'
import axios from 'axios';

const ForgetPasswd = () =>
    {
        const navigate = useNavigate();
        const [formData, setFormData] = useState({
            email: '',
            senha: '',
            senhaConfirmada: ''
        });
        const [erro, setErro] = useState('');

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({
            ...formData,
            [e.target.name]: e.target.value
            });
        };

        const handleSubmit = async (e: React.FormEvent) =>
            {
                e.preventDefault();
                setErro('');

                try{
                    const response = await axios.post('http://localhost:3000/api/user/esqueci-senha', formData, {headers: {
                        'Content-Type': 'application/json'
                        }});

                        localStorage.setItem('token', response.data.token);
                        navigate('/');
                    } catch (error: any) {
                        if (error.response?.data?.message) {
                            setErro(error.response.data.message);
                        } else {
                            setErro('Erro ao fazer recuperação de senha.');
                        }
                    }
            }
        return(
             <div className="pageFP">
                ' <form className="auth-form" onSubmit={handleSubmit}>
                    <h2>Esqueceu a senha?</h2>
                    <p>Sem problemas! Preencha os campos abaixo para recupera-la</p>
                    
                    <div className="form-FP">
                        <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    
                    <div className="form-FP">
                        <input
                        type="password"
                        name="senha"
                        placeholder="Senha"
                        value={formData.senha}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    <div className="form-FP">
                        <input
                        type="password"
                        name="senhaConfirmada"
                        placeholder="Confirme a senha"
                        value={formData.senhaConfirmada}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    

                    
                    <button 
                        type="submit" 
                        className="btn-primary"

                    >
                        Recuperar
                    </button>
                    
                    {erro && <div className="error-message">{erro}</div>}
                    </form>
                </div>
        );


        
    };

    export default ForgetPasswd;
