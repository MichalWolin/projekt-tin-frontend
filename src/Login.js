import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import pl from './locales/pl.json';
import en from './locales/en.json';

function Login() {
  const [cookies, setCookie] = useCookies(['user']);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const translations = cookies.user && cookies.user.language === 'polish' ? pl : en;

  useEffect(() => {
    if (cookies.user && cookies.user.role !== 'guest') {
      navigate("/");
    }
  }, [cookies.user, navigate]);

  const handleLoginChange = (event) => {
    setLogin(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "login": login,
        "password": password
      })
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          setErrorMessage(translations.incorrect_login);
          return null;
        } else {
          setErrorMessage(translations.unexpected_error);
          return null;
        }
      })
      .then((data) => {
        if (data) {
          setSuccessMessage(translations.successfull_login);
          const user = data.user[0];
          setCookie('user', { id: user.id, role: user.role, language: 'polish' }, { path: '/', maxAge: 3600 });
          setTimeout(() => {
            navigate("/");
          }, 0);
        }
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(translations.connection_error);
      });
  };

  return (
    <div className="div-align">
      <h2>{translations.sign_in}</h2>
        <form>
          <label>Login</label>
          <input type="text" placeholder="Login" value={login} onChange={handleLoginChange} />
          <label>{translations.password}</label>
          <input type="password" placeholder="Hasło" value={password} onChange={handlePasswordChange} />
          <button className="form-button" onClick={handleSubmit}>{translations.sign_in}</button>
          <p className="success-message">{successMessage}</p>
          <p className="error-message">{errorMessage}</p>
        </form>
    </div>
  );
}

export default Login;