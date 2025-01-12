import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

function Login() {
  const [cookies, setCookie] = useCookies(['user']);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

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
          setErrorMessage("Nieprawidłowy login lub hasło.");
          return null;
        } else {
          setErrorMessage("Wystąpił nieoczekiwany błąd.");
          return null;
        }
      })
      .then((data) => {
        if (data) {
          setSuccessMessage("Pomyślnie zalogowano.");
          const user = data.user[0];
          setCookie('user', { id: user.id, role: user.role }, { path: '/', maxAge: 3600 });
          setTimeout(() => {
            navigate("/");
          }, 0);
        }
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Błąd połączenia z serwerem.")
      });
  };

  return (
    <div className="div-align">
      <h2>Zaloguj się</h2>
        <form>
          <label>Login</label>
          <input type="text" placeholder="Login" value={login} onChange={handleLoginChange} />
          <label>Hasło</label>
          <input type="password" placeholder="Hasło" value={password} onChange={handlePasswordChange} />
          <button className="form-button" onClick={handleSubmit}>Zaloguj</button>
          <p className="success-message">{successMessage}</p>
          <p className="error-message">{errorMessage}</p>
        </form>
    </div>
  );
}

export default Login;