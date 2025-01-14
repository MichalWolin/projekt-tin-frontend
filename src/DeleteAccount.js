import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import pl from './locales/pl.json';
import en from './locales/en.json';

function DeleteAccount() {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const translations = cookies.user && cookies.user.language === 'polish' ? pl : en;

  useEffect(() => {
    if (!cookies.user || (cookies.user.role !== "manager" && cookies.user.role !== "player")) {
      navigate("/");
    }
  }, [cookies.user]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    fetch(`http://localhost:3000/users/${cookies.user.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "user_id": cookies.user.id
      })
    })
    .then(response => {
      if (response.status === 200) {
        setSuccessMessage(translations.account_deleted);
        setTimeout(() => {
          removeCookie('user', { path: '/' });
          navigate('/');
        }, 5000);
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
      <h2>{translations.are_you_sure}</h2>
      <p className="error-message">{translations.irreversible}</p>
      <button className="form-button" onClick={handleSubmit}>{translations.delete_account}</button>
      <p className="error-message">{errorMessage}</p>
      <p className="success-message">{successMessage}</p>
    </div>
  );
};

export default DeleteAccount;