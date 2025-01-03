import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Register() {
  const [cookies] = useCookies(['user']);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('player');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('male');
  const [successMessage, setSuccessMessage] = useState('');
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

  const handleRepeatPasswordChange = (event) => {
    setRepeatPassword(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSurnameChange = (event) => {
    setSurname(event.target.value);
  };

  const handleBirthdateChange = (event) => {
    setBirthdate(event.target.value);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost:3000/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "login": login,
        "password": password,
        "email": email,
        "role": role,
        "name": name,
        "surname": surname,
        "birthdate": birthdate,
        "gender": gender
      })
    })
    .then(response => response.json())
    .then((data) => {
      setSuccessMessage("Pomyślnie zarejestrowano użytkownika.");
      setTimeout(() => {
        navigate("/");
      }, 5000);
    })
    .catch((error) => console.error("Error while registering player", error));
  };

  return (
    <div className="div-align">
      <h2>Zarejestruj się</h2>
      <form>
        {/* TODO: Walidacja */}
        <label>Login</label>
        <input type="text" placeholder="Login" value={login} onChange={handleLoginChange} />
        <label>Hasło</label>
        <input type="password" placeholder="Hasło" value={password} onChange={handlePasswordChange} />
        <label>Powtórz hasło</label>
        <input type="password" placeholder="Powtórz hasło" value={repeatPassword} onChange={handleRepeatPasswordChange} />
        <label>E-mail</label>
        <input type="text" placeholder="E-mail" value={email} onChange={handleEmailChange} />
        <label>Typ użytkownika</label>
        <select name="role" onChange={handleRoleChange}>
          <option value="player">Gracz tenisa</option>
          <option value="manager">Menadżer turniejów</option>
        </select>
        {role === 'player' && (
          <>
            <label>Imię</label>
            <input type="text" placeholder="Imię" value={name} onChange={handleNameChange} />
            <label>Nazwisko</label>
            <input type="text" placeholder="Nazwisko" value={surname} onChange={handleSurnameChange} />
            <label>Data urodzenia</label>
            <input type="date" placeholder="Data urodzenia" value={birthdate} onChange={handleBirthdateChange} />
            <label>Płeć</label>
            <select name="gender" onChange={handleGenderChange}>
              <option value="male">Mężczyzna</option>
              <option value="female">Kobieta</option>
            </select>
          </>
        )}
        <button className="form-button" onClick={handleSubmit}>Zarejestruj</button>
        <p className="success-message">{successMessage}</p>
      </form>
    </div>
  );
}

export default Register;