import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Post {
  id_post: number;
  titulo: string;
  conteudo: string;
  imagem?: string;
  id_usuario: number;
  data_criacao?: string;
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/post/posts');
      setPosts(response.data);
      setError('');
    } catch (err) {
      console.error('Erro ao buscar posts', err);
      setError('Erro ao carregar posts. Verifique se o servidor está rodando.');
    } 
  };

  const deletePost = async (postId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este artigo?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:3000/api/post/posts', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: { id_post: postId }
      });
      
      setPosts(posts.filter(post => post.id_post !== postId));
    } catch (error) {
      console.error('Erro ao deletar post:', error);
      alert('Erro ao deletar post');
    }
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };


  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ color: '#dc3545', textAlign: 'center' }}>
          <p>{error}</p>
          <button onClick={fetchPosts} className="btn-primary" style={{ marginTop: '10px' }}>
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <aside className="sidebar">
        
        <div style={{ marginTop: '30px' }}>
          <h3>Ações</h3>
          <Link to="/create-post" className="sidebar-item">
            ✏️ Criar Artigo
          </Link>
          <Link to="/profile" className="sidebar-item">
            👤 Meu Perfil
          </Link>
        </div>
      </aside>

      <main className="posts-container">
        {posts.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            background: '#2a2a2a',
            borderRadius: '12px'
          }}>
            <h2 style={{ color: '#ccc', marginBottom: '20px' }}>Nenhum artigo encontrado</h2>
            <p style={{ color: '#888', marginBottom: '30px' }}>
              Seja o primeiro a compartilhar conhecimento!
            </p>
            <Link to="/create-post" className="btn-primary" style={{ display: 'inline-block' }}>
              Criar Primeiro Artigo
            </Link>
          </div>
        ) : (
          posts.map((post) => (
            <article key={post.id_post} className="post-card">
              {post.imagem && (
                <img 
                  src={post.imagem} 
                  alt={post.titulo}
                  className="post-image"
                />
              )}
              
              <div className="post-content">
                <h2 className="post-title">{post.titulo}</h2>
                <p className="post-description">
                  {truncateText(post.conteudo)}
                </p>
                
                <div className="post-meta">
                  <div>
                    <span style={{ margin: '0 10px' }}>•</span>
                    <span>📅 {new Date().toLocaleDateString('pt-BR')}</span>
                  </div>
                  
                  <div className="post-actions">
                    <button 
                      className="btn-small"
                      style={{ background: '#28a745', color: 'white' }}
                      onClick={() => {/* Ver artigo completo */}}
                    >
                      👁️ Ver
                    </button>
                    <Link 
                      to={`/edit-post/${post.id_post}`}
                      className="btn-small btn-edit"
                    >
                      ✏️ Editar
                    </Link>
                    <button 
                      className="btn-small btn-delete"
                      onClick={() => deletePost(post.id_post)}
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </main>
    </div>
  );
};

export default Home;