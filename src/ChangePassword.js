import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

function ChangePassword() {
  //TODO: Walidacja
  const [cookies] = useCookies(['user']);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
    setErrorMessage('');
    setSuccessMessage('');
    event.preventDefault();
    if (newPassword !== repeatNewPassword) {
      setErrorMessage('Nowe hasła nie są takie same.');
      return;
    }

    fetch(`http://localhost:3000/users/password/${cookies.user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        oldPassword: oldPassword,
        newPassword: newPassword
      })
    })
    .then(response => {
      if (response.status === 200) {
        setSuccessMessage('Hasło zostało zmienione.');
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
        <label>Nowe hasło</label>
        <input type="password" value={newPassword} onChange={handleNewPasswordChange} placeholder="Nowe hasło"/>
        <label>Powtórz nowe hasło</label>
        <input type="password" value={repeatNewPassword} onChange={handleRepeatNewPasswordChange} placeholder="Powtórz nowe hasło"/>
        <button className="form-button" onClick={handleSubmit}>Zmień hasło</button>
        <p className="error-message">{errorMessage}</p>
        <p className="success-message">{successMessage}</p>
      </form>
    </div>
  );
};

export default ChangePassword;