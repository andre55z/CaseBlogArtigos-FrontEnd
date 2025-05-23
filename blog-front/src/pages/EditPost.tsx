import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: ''
  });
  const [imagem, setImagem] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [currentImage, setCurrentImage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoadingPost(true);
      // Como não temos endpoint para buscar post específico, vamos buscar todos e filtrar
      const response = await axios.get('http://localhost:3000/api/post/posts');
      const post = response.data.find((p: any) => p.id_post === parseInt(id || '0'));
      
      if (post) {
        setFormData({
          titulo: post.titulo,
          conteudo: post.conteudo
        });
        if (post.imagem) {
          setCurrentImage(post.imagem);
        }
      } else {
        setError('Post não encontrado');
      }
    } catch (error) {
      setError('Erro ao carregar post');
    } finally {
      setLoadingPost(false);
    }
  };

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
      formDataToSend.append('id_post', id || '');
      if (imagem) {
        formDataToSend.append('imagem', imagem);
      }

      await axios.put('http://localhost:3000/api/post/posts', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/', { state: { message: 'Artigo atualizado com sucesso!' } });
    } catch (error: any) {
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError(error.response?.data?.message || 'Erro ao atualizar artigo');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingPost) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ color: '#ccc' }}>Carregando artigo...</div>
      </div>
    );
  }

  if (error && !formData.titulo) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ color: '#dc3545', textAlign: 'center' }}>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '10px' }}>
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>✏️ Editar Artigo</h2>
        <p style={{ color: '#ccc', marginBottom: '30px' }}>
          Faça as alterações necessárias no seu artigo
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
              placeholder="Escreva seu artigo aqui..."
              value={formData.conteudo}
              onChange={handleChange}
              rows={12}
              required
            />
          </div>

          <div className="form-group">
            <label>Imagem de Capa</label>
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
                  <p>Nova imagem selecionada - Clique para alterar</p>
                </div>
              ) : currentImage ? (
                <div>
                  <img 
                    src={currentImage} 
                    alt="Imagem atual" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '200px', 
                      borderRadius: '8px',
                      marginBottom: '10px'
                    }} 
                  />
                  <p>Imagem atual - Clique para alterar</p>
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
              {loading ? 'Salvando...' : '💾 Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;