import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import logo from "./logo.png";
import Home from "./Home";
import Ranking from "./Ranking";
import Tournaments from "./Tournaments";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import Settings from "./Settings";
import EditData from "./EditData";
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import AddTournament from './AddTournament';
import EditTournament from './EditTournament';
import EditMatch from './EditMatch';
import Matches from './Matches';
import AddMatch from './AddMatch';
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import PolishFlag from './poland.png';
import EnglishFlag from './usa.png';
import pl from './locales/pl.json';
import en from './locales/en.json';

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const navigate = useNavigate();
  const translations = cookies.user && cookies.user.language === 'polish' ? pl : en;

  const handleLogout = () => {
    navigate('/');
    setTimeout(() => {
      removeCookie('user', { path: '/' });
    }, 10);
  };

  useEffect(() => {
    if (!cookies.user) {
      setCookie('user', { role: 'guest', language: 'polish' }, { path: '/' });
    }
  }, [cookies.user, setCookie]);

  const handleChangeLanguage = (language) => {
    setCookie('user', { ...cookies.user, language: language }, { path: '/' });
    navigate('/');
  };

  return (
    <div className="App">
      <header>
        <div className="logo-title">
          <Link to="/">
            <img src={logo} alt="logo" className="logo"></img>
          </Link>
          <h1 className="title">{translations.title}</h1>
        </div>
        <nav>
          <Link to="/" className="nav-button">{translations.main_page}</Link>
          <Link to="/ranking" className="nav-button">Ranking</Link>
          <Link to="/tournaments" className="nav-button">{translations.tournaments}</Link>
          
          {(!cookies.user || cookies.user.role === 'guest') && 
            <>
              <Link to="/login" className="nav-button">{translations.sign_in}</Link>
              <Link to="/register" className="nav-button">{translations.register}</Link>
            </>
          }
          {cookies.user && cookies.user.role === 'player' &&
            <>
              <Link to={`/profile/${cookies.user.id}`} className="nav-button">{translations.profile}</Link>
            </>
          }
          {cookies.user && (cookies.user.role === 'player' || cookies.user.role === 'manager') &&
            <>
              <Link to="/settings" className="nav-button">{translations.settings}</Link>
              <button className="nav-button" onClick={handleLogout}>{translations.log_out}</button>
            </>
          }
          <div className="language-buttons">
            <img src={PolishFlag} className="flag" onClick={() => handleChangeLanguage('polish')}></img>
            <img src={EnglishFlag} className="flag" onClick={() => handleChangeLanguage('english')}></img>
          </div>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/edit-data" element={<EditData />} /> 
          <Route path="/settings/change-password" element={<ChangePassword />} />
          <Route path="/settings/delete-account" element={<DeleteAccount />} />
          <Route path="/tournaments/add-tournament" element={<AddTournament />} />
          <Route path="/tournaments/edit-tournament/:id" element={<EditTournament />} />
          <Route path="/tournaments/matches/:id" element={<Matches />} />
          <Route path="/tournaments/add-match/:id" element={<AddMatch />} />
          <Route path="/matches/edit-match/:id" element={<EditMatch />} />
          <Route path="*" element={<p className="error-message">{translations.not_found}</p>} />
        </Routes>
      </main>
      <footer>
        <p>{translations.made_by} Michał Woliński s29239</p>
      </footer>
    </div>
  );
}

export default App;