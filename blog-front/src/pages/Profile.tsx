import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Buscar todos os posts (idealmente filtrar por usuário no backend)
      const response = await axios.get('http://localhost:3000/api/post/posts');
      const posts = response.data;
      
      setUserPosts(posts);
      setStats({
        totalPosts: posts.length,
        totalViews: posts.length * 15, // Simulado
        totalLikes: posts.length * 8   // Simulado
      });
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    } finally {
      setLoading(false);
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
      
      setUserPosts(userPosts.filter((post: any) => post.id_post !== postId));
      setStats(prev => ({
        ...prev,
        totalPosts: prev.totalPosts - 1
      }));
    } catch (error) {
      console.error('Erro ao deletar post:', error);
      alert('Erro ao deletar post');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ color: '#ccc' }}>Carregando perfil...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header do Perfil */}
      <div className="profile-header">
        <div className="profile-avatar">AL</div>
        <h1>André Lucca </h1>
        <p style={{ color: '#ccc', marginBottom: '20px' }}>
          Desenvolvedor Full Stack | Entusiasta da TI
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '20px',
          marginTop: '20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
              {stats.totalPosts}
            </div>
            <div style={{ color: '#888', fontSize: '14px' }}>Artigos</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
              {stats.totalViews}
            </div>
            <div style={{ color: '#888', fontSize: '14px' }}>Visualizações</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
              {stats.totalLikes}
            </div>
            <div style={{ color: '#888', fontSize: '14px' }}>Curtidas</div>
          </div>
        </div>
      </div>

      {/* Ações do Perfil */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px',
        marginBottom: '30px'
      }}>
        <Link 
          to="/create-post" 
          className="btn-primary"
          style={{ 
            textAlign: 'center',
            textDecoration: 'none',
            padding: '15px'
          }}
        >
           Criar Novo Artigo
        </Link>

      </div>

      {/* Lista de Artigos do Usuário */}
      <div style={{ 
        background: '#2a2a2a', 
        borderRadius: '12px', 
        padding: '20px' 
      }}>
        <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Meus Artigos ({stats.totalPosts})
        </h2>
        
        {userPosts.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#888'
          }}>
            <p>Você ainda não criou nenhum artigo.</p>
            <Link 
              to="/create-post" 
              className="btn-primary"
              style={{ 
                display: 'inline-block',
                marginTop: '15px',
                textDecoration: 'none'
              }}
            >
              Criar Primeiro Artigo
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {userPosts.map((post: any) => (
              <div 
                key={post.id_post}
                style={{
                  background: '#1a1a1a',
                  borderRadius: '8px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    color: '#fff', 
                    marginBottom: '8px',
                    fontSize: '16px'
                  }}>
                    {post.titulo}
                  </h3>
                  <p style={{ 
                    color: '#ccc', 
                    fontSize: '14px',
                    marginBottom: '10px',
                    lineHeight: '1.4'
                  }}>
                    {post.conteudo.length > 100 
                      ? post.conteudo.substring(0, 100) + '...' 
                      : post.conteudo
                    }
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    gap: '15px',
                    fontSize: '12px',
                    color: '#888'
                  }}>
                    <span>📅 {new Date().toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '8px',
                  marginLeft: '20px'
                }}>
                  <Link
                    to={`/edit-post/${post.id_post}`}
                    className="btn-small btn-edit"
                  >
                    ✏️
                  </Link>
                  <button
                    className="btn-small btn-delete"
                    onClick={() => deletePost(post.id_post)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;