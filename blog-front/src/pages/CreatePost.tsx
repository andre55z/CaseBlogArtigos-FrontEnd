import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: ''
  });
  const [imagem, setImagem] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagem(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.titulo.trim() || !formData.conteudo.trim()) {
      setError('Título e conteúdo são obrigatórios');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('conteudo', formData.conteudo);
      if (imagem) {
        formDataToSend.append('imagem', imagem);
      }

      await axios.post('http://localhost:3000/api/post/posts', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/', { state: { message: 'Artigo criado com sucesso!' } });
    } catch (error: any) {
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError(error.response?.data?.message || 'Erro ao criar artigo');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>✏️ Criar Novo Artigo</h2>
        <p style={{ color: '#ccc', marginBottom: '30px' }}>
          Compartilhe seu conhecimento com a comunidade
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="titulo">Título *</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              placeholder="Digite um título chamativo para seu artigo"
              value={formData.titulo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="conteudo">Conteúdo *</label>
            <textarea
              id="conteudo"
              name="conteudo"
              placeholder="Escreva seu artigo aqui... Use sua criatividade para engajar os leitores!"
              value={formData.conteudo}
              onChange={handleChange}
              rows={12}
              required
            />
          </div>

          <div className="form-group">
            <label>Imagem de Capa (Opcional)</label>
            <div className="file-upload" onClick={() => document.getElementById('imagem')?.click()}>
              <input
                type="file"
                id="imagem"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview ? (
                <div>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '200px', 
                      borderRadius: '8px',
                      marginBottom: '10px'
                    }} 
                  />
                  <p>Clique para alterar a imagem</p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>📷</div>
                  <p>Clique para adicionar uma imagem</p>
                  <small style={{ color: '#888' }}>PNG, JPG ou GIF até 5MB</small>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div style={{ 
              color: '#dc3545', 
              background: '#2a1f1f', 
              padding: '12px', 
              borderRadius: '6px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                border: '1px solid #3a3a3a',
                borderRadius: '8px',
                color: '#ccc',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ padding: '12px 24px' }}
            >
              {loading ? 'Publicando...' : '📝 Publicar Artigo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;