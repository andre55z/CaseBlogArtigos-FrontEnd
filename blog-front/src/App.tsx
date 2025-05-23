import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Home from './pages/Home';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Header from './components/Header';
import './App.css';
import ForgetPasswd from './pages/ForgetPasswd';
import Articles from './pages/Articles';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Aqui você pode decodificar o token para pegar dados do usuário
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="app">
        {isAuthenticated && (
          <Header 
            user={user} 
            onLogout={handleLogout}
          />
        )}
        
        <Routes>
          <Route 
            path="/" 
            element={
              !isAuthenticated ? 
              <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} /> : 
              <Home />
            } 
          />
          <Route 
            path="/login" 
            element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} 
          />
          <Route path="/registro" element={<Registro />} />
          <Route path="/esqueci-senha/*" element={<ForgetPasswd/>}/>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
          <Route path="/articles" element={<Articles/>} />
       </Routes>
      </div>
    </Router>
  );
};

export default App;