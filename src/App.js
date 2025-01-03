import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import logo from "./logo.png";
import Home from "./Home";
import Ranking from "./Ranking";
import Tournaments from "./Tournaments";
import Login from "./Login";
import Register from "./Register";
import { useCookies } from "react-cookie";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);

  const handleLogout = () => {
    removeCookie('user', { path: '/' });
  };

  useEffect(() => {
    if (!cookies.user) {
      setCookie('user', { role: 'guest' }, { path: '/' });
    }
  }, [cookies.user, setCookie]);

  return (
    <Router>
      <div className="App">
        <header>
          <div className="logo-title">
            <Link to="/">
              <img src={logo} alt="logo" className="logo"></img>
            </Link>
            <h1 className="title">Turnieje Tenisowe</h1>
          </div>
          <nav>
            <Link to="/" className="nav-button">Strona Główna</Link>
            <Link to="/ranking" className="nav-button">Ranking</Link>
            <Link to="/tournaments" className="nav-button">Turnieje</Link>
            
            {!cookies.user || cookies.user.role === 'guest' ? (
              <>
                <Link to="/login" className="nav-button">Zaloguj się</Link>
                <Link to="/register" className="nav-button">Zarejestruj się</Link>
              </>
            ) : (
              <>
                <button className="nav-button" onClick={handleLogout}>Wyloguj się</button>
              </>
            )}
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <footer>
          {/* <p>Made by Michał Woliński s29239</p> */}
          <p>Twoja rola: {cookies.user ? cookies.user.role : 'guest'}</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;