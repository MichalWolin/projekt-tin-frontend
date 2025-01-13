import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
  const [cookies] = useCookies(['user']);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [repeatNewPasswordError, setRepeatNewPasswordError] = useState('');

  useEffect(() => {
    if (!cookies.user || (cookies.user.role !== "manager" && cookies.user.role !== "player")) {
      navigate("/");
    }
  }, [cookies.user]);

  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleRepeatNewPasswordChange = (event) => {
    setRepeatNewPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setOldPasswordError('');
    setNewPasswordError('');
    setRepeatNewPasswordError('');
    let error = false;

    if (oldPassword === '') {
      setOldPasswordError('To pole jest wymagane.');
      error = true;
    }

    if (newPassword === '') {
      setNewPasswordError('To pole jest wymagane.');
      error = true;
    }

    if (repeatNewPassword === '') {
      setRepeatNewPasswordError('To pole jest wymagane.');
      error = true;
    }
    //check for spaces
    if (/\s/.test(newPassword)) {
      setNewPasswordError('Hasło nie może zawierać spacji.');
      error = true;
    }

    if (newPassword.length < 8) {
      setNewPasswordError('Hasło musi mieć co najmniej 8 znaków.');
      error = true;
    }

    if (!/\d/.test(newPassword)) {
      setNewPasswordError('Hasło musi zawierać co najmniej jedną cyfrę.');
      error = true;
    }

    if (!/[!@#$%]/.test(newPassword)) {
      setNewPasswordError('Hasło musi zawierać co najmniej jeden znak specjalny (!, @, #, $ lub %).');
      error = true;
    }

    if (newPassword !== repeatNewPassword) {
      setRepeatNewPasswordError('Hasła nie są takie same.');
      error = true;
    }

    if (error) {
      return;
    }

    fetch(`http://localhost:3000/users/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "old_password": oldPassword,
        "new_password": newPassword,
        "repeat_new_password": repeatNewPassword,
        "user_id": cookies.user.id
      })
    })
    .then(response => {
      if (response.status === 200) {
        setSuccessMessage('Hasło zostało zmienione.');
        setOldPassword('');
        setNewPassword('');
        setRepeatNewPassword('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else if (response.status === 401) {
        setErrorMessage('Stare hasło jest niepoprawne.');
      } else {
        setErrorMessage('Wystąpił nieoczekiwany błąd.');
      }
    })
    .catch((error) => {
      console.log(error);
      setErrorMessage('Błąd połączenia z serwerem.');
    });
  
  };

  return (
    <div className="div-align">
      <h2>Zmień hasło</h2>
      <form>
        <label>Stare hasło</label>
        <input type="password" value={oldPassword} onChange={handleOldPasswordChange} placeholder="Stare hasło"/>
        <p className="error-message">{oldPasswordError}</p>
        <label>Nowe hasło</label>
        <input type="password" value={newPassword} onChange={handleNewPasswordChange} placeholder="Nowe hasło"/>
        <p className="error-message">{newPasswordError}</p>
        <label>Powtórz nowe hasło</label>
        <input type="password" value={repeatNewPassword} onChange={handleRepeatNewPasswordChange} placeholder="Powtórz nowe hasło"/>
        <p className="error-message">{repeatNewPasswordError}</p>
        <button className="form-button" onClick={handleSubmit}>Zmień hasło</button>
        <p className="error-message">{errorMessage}</p>
        <p className="success-message">{successMessage}</p>
      </form>
    </div>
  );
};

export default ChangePassword;