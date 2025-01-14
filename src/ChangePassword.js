import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import pl from './locales/pl.json';
import en from './locales/en.json';

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
  const translations = cookies.user && cookies.user.language === 'polish' ? pl : en;

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
      setOldPasswordError(translations.field_required);
      error = true;
    }

    if (newPassword === '') {
      setNewPasswordError(translations.field_required);
      error = true;
    }

    if (repeatNewPassword === '') {
      setRepeatNewPasswordError(translations.field_required);
      error = true;
    }

    if (/\s/.test(newPassword)) {
      setNewPasswordError(translations.password_no_spaces);
      error = true;
    }

    if (newPassword.length < 8) {
      setNewPasswordError(translations.password_too_short);
      error = true;
    }

    if (!/\d/.test(newPassword)) {
      setNewPasswordError(translations.password_no_digit);
      error = true;
    }

    if (!/[!@#$%]/.test(newPassword)) {
      setNewPasswordError(translations.password_no_special);
      error = true;
    }

    if (newPassword !== repeatNewPassword) {
      setRepeatNewPasswordError(translations.passwords_not_match);
      error = true;
    }

    if (error) {
      return;
    }

    fetch(`http://localhost:3000/users/password/${cookies.user.id}`, {
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
        setSuccessMessage(translations.password_changed);
        setOldPassword('');
        setNewPassword('');
        setRepeatNewPassword('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else if (response.status === 401) {
        setErrorMessage(translations.wrong_password);
      } else {
        setErrorMessage(translations.unexpected_error);
      }
    })
    .catch((error) => {
      console.log(error);
      setErrorMessage(translations.connection_error);
    });
  
  };

  return (
    <div className="div-align">
      <h2>{translations.change_password}</h2>
      <form>
        <label>{translations.old_password}</label>
        <input type="password" value={oldPassword} onChange={handleOldPasswordChange} />
        <p className="error-message">{oldPasswordError}</p>
        <label>{translations.new_password}</label>
        <input type="password" value={newPassword} onChange={handleNewPasswordChange} />
        <p className="error-message">{newPasswordError}</p>
        <label>{translations.repeat_password}</label>
        <input type="password" value={repeatNewPassword} onChange={handleRepeatNewPasswordChange} />
        <p className="error-message">{repeatNewPasswordError}</p>
        <button className="form-button" onClick={handleSubmit}>{translations.change_password}</button>
        <p className="error-message">{errorMessage}</p>
        <p className="success-message">{successMessage}</p>
      </form>
    </div>
  );
};

export default ChangePassword;