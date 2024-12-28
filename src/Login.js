import React, { useState } from "react";

function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginChange = (event) => {
    setLogin(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
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
      .then(response => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  };

  return (
    <div className="div-align">
      <h2>Zaloguj się</h2>
        <form>
          <label>Login</label>
          <input type="text" placeholder="Login" value={login} onChange={handleLoginChange} />
          <label>Hasło</label>
          <input type="password" placeholder="Hasło" value={password} onChange={handlePasswordChange} />
          <button onClick={handleSubmit}>Zaloguj</button>
        </form>
    </div>
  );
}

export default Login;