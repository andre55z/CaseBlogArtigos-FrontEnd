import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  user: any;
  onLogout: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="header-logo">M.</Link>

        <nav className="header-nav">
          <Link 
            to="/" 
            className={isActive('/') ? 'active' : ''}
          >
            Home
          </Link>
          <Link 
            to="/articles" 
            className={isActive('/articles') ? 'active' : ''}
          >
            Artigos
          </Link>
          <Link 
            to="/create-post" 
            className={isActive('/create-post') ? 'active' : ''}
          >
            Criar Artigo
          </Link>
        </nav>
      </div>

      <div className="header-right">


        {user && (
          <div 
            className="user-menu"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="user-avatar">
              {user?.nomeusuario?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span>{user?.nomeusuario || 'Usuário'}</span>
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 12 12" 
              fill="currentColor"
              style={{ transform: showDropdown ? 'rotate(180deg)' : 'none' }}
            >
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        )}
        {!user && (<Link to="/login" className="login-button">
            Login
        </Link>)}
        {user && showDropdown && (
          <div className="dropdown-menu">
            <Link 
              to="/profile" 
              className="dropdown-item"
              onClick={() => setShowDropdown(false)}
            >
              Perfil
            </Link>
            <Link 
              to="/articles" 
              className="dropdown-item"
              onClick={() => setShowDropdown(false)}
            >
              Meus Artigos
            </Link>
            <Link 
              to="/settings" 
              className="dropdown-item"
              onClick={() => setShowDropdown(false)}
            >
              Configurações
            </Link>

            <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #3a3a3a' }} />
            <button 
              className="dropdown-item" 
              onClick={() => {
                setShowDropdown(false);
                onLogout();
              }}
              style={{ 
                background: 'none', 
                border: 'none', 
                width: '100%', 
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
