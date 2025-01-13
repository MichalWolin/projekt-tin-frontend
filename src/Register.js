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
  const [loginError, setLoginError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [repeatPasswordError, setRepeatPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [nameError, setNameError] = useState('');
  const [surnameError, setSurnameError] = useState('');
  const [birthdateError, setBirthdateError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
    setSuccessMessage('');
    setErrorMessage('');
    setLoginError('');
    setPasswordError('');
    setRepeatPasswordError('');
    setEmailError('');
    setRoleError('');
    setNameError('');
    setSurnameError('');
    setBirthdateError('');
    setGenderError('');
    let error = false;

    if (login === '') {
      setLoginError('To pole jest wymagane.');
      error = true;
    }

    if (password === '') {
      setPasswordError('To pole jest wymagane.');
      error = true;
    }

    if (repeatPassword === '') {
      setRepeatPasswordError('To pole jest wymagane.');
      error = true;
    }

    if (email === '') {
      setEmailError('To pole jest wymagane.');
      error = true;
    }

    if (role === '') {
      setRoleError('To pole jest wymagane.');
      error = true;
    }

    if (login.length < 3 || login.length > 255) {
      setLoginError('Login musi mieć od 3 do 255 znaków.');
      error = true;
    }

    if (/\s/.test(login)) {
      setLoginError('Login nie może zawierać spacji.');
      error = true;
    }

    if (password.length < 8) {
      setPasswordError('Hasło musi mieć co najmniej 8 znaków.');
      error = true;
    }

    if (/\s/.test(password)) {
      setPasswordError('Hasło nie może zawierać spacji.');
      error = true;
    }

    if (!/\d/.test(password)) {
      setPasswordError('Hasło musi zawierać co najmniej jedną cyfrę.');
      error = true;
    }

    if (!/[!@#$%]/.test(password)) {
      setPasswordError('Hasło musi zawierać co najmniej jeden znak specjalny (!, @, #, $ lub %).');
      error = true;
    }

    if (password !== repeatPassword) {
      setRepeatPasswordError('Hasła nie są takie same.');
      error = true;
    }

    if (!/^[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+$/.test(email)) {
      setEmailError('Niepoprawny format adresu e-mail.');
      error = true;
    }

    if (role === 'player') {
      if (name === '') {
        setNameError('To pole jest wymagane.');
        error = true;
      }

      if (surname === '') {
        setSurnameError('To pole jest wymagane.');
        error = true;
      }

      if (birthdate === '') {
        setBirthdateError('To pole jest wymagane.');
        error = true;
      }

      if (gender !== "male" && gender !== "female") {
        setGenderError("Nieprawidłowa płeć.");
        error = true;
      }

      if (name.length < 3 || name.length > 255) {
        setNameError('Imię musi mieć od 3 do 255 znaków.');
        error = true;
      }

      if (/\s/.test(name)) {
        setNameError('Imię nie może zawierać spacji.');
        error = true;
      }

      if (surname.length < 3 || surname.length > 255) {
        setSurnameError('Nazwisko musi mieć od 3 do 255 znaków.');
        error = true;
      }

      if (/\s/.test(surname)) {
        setSurnameError('Nazwisko nie może zawierać spacji.');
        error = true;
      }

      const birthdateObj = new Date(birthdate);

      if (birthdateObj > new Date()) {
        setBirthdateError('Data urodzenia nie może być z przyszłości.');
        error = true;
      }

      if (new Date() - birthdateObj < 24 * 60 * 60 * 1000 * 365 * 16) {
        setBirthdateError('Musisz mieć co najmniej 16 lat.');
        error = true;
      }
    }

    if (error) {
      return;
    }

    fetch("http://localhost:3000/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "login": login,
        "password": password,
        "repeatPassword": repeatPassword,
        "email": email,
        "role": role,
        "name": name,
        "surname": surname,
        "birthdate": birthdate,
        "gender": gender
      })
    })
    .then(response => {
      if (response.status === 201) {
        setSuccessMessage("Pomyślnie zarejestrowano użytkownika.");
        setLogin('');
        setPassword('');
        setRepeatPassword('');
        setEmail('');
        setRole('player');
        setName('');
        setSurname('');
        setBirthdate('');
        setGender('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else if (response.status === 400) {
        setLoginError('Podany login jest już zajęty.');
      } else {
        setErrorMessage("Wystąpił nieoczekiwany błąd.");
        return null;
      }
    })
    .catch((error) => console.error("Error while registering player", error));
  };

  return (
    <div className="div-align">
      <h2>Zarejestruj się</h2>
      <form>
        <label>Login</label>
        <input type="text" placeholder="Login" value={login} onChange={handleLoginChange} />
        <p className="error-message">{loginError}</p>
        <label>Hasło</label>
        <input type="password" placeholder="Hasło" value={password} onChange={handlePasswordChange} />
        <p className="error-message">{passwordError}</p>
        <label>Powtórz hasło</label>
        <input type="password" placeholder="Powtórz hasło" value={repeatPassword} onChange={handleRepeatPasswordChange} />
        <p className="error-message">{repeatPasswordError}</p>
        <label>E-mail</label>
        <input type="text" placeholder="E-mail" value={email} onChange={handleEmailChange} />
        <p className="error-message">{emailError}</p>
        <label>Typ użytkownika</label>
        <select name="role" onChange={handleRoleChange}>
          <option value="player">Gracz tenisa</option>
          <option value="manager">Menadżer turniejów</option>
        </select>
        <p className="error-message">{roleError}</p>
        {role === 'player' && (
          <>
            <label>Imię</label>
            <input type="text" placeholder="Imię" value={name} onChange={handleNameChange} />
            <p className="error-message">{nameError}</p>
            <label>Nazwisko</label>
            <input type="text" placeholder="Nazwisko" value={surname} onChange={handleSurnameChange} />
            <p className="error-message">{surnameError}</p>
            <label>Data urodzenia</label>
            <input type="date" placeholder="Data urodzenia" value={birthdate} onChange={handleBirthdateChange} />
            <p className="error-message">{birthdateError}</p>
            <label>Płeć</label>
            <select name="gender" onChange={handleGenderChange}>
              <option value="male">Mężczyzna</option>
              <option value="female">Kobieta</option>
            </select>
            <p className="error-message">{genderError}</p>
          </>
        )}
        <button className="form-button" onClick={handleSubmit}>Zarejestruj</button>
        <p className="success-message">{successMessage}</p>
        <p className="error-message">{errorMessage}</p>
      </form>
    </div>
  );
}

export default Register;