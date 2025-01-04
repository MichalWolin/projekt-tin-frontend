import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

function DeleteAccount() {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    setErrorMessage('');
    setSuccessMessage('');
    event.preventDefault();
    fetch(`http://localhost:3000/users/${cookies.user.id}`, {
      method: "DELETE"
    })
    .then(response => {
      if (response.status === 200) {
        setSuccessMessage('Konto zostało usunięte.');
        removeCookie('user', { path: '/' });
        setTimeout(() => {
          navigate('/');
        }, 5000);
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
      <h2>Czy na pewno chcesz usunąć konto?</h2>
      <p className="error-message">Uwaga! Operacja jest nieodwracalna.</p>
      <button className="form-button" onClick={handleSubmit}>Usuń konto</button>
      <p className="error-message">{errorMessage}</p>
      <p className="success-message">{successMessage}</p>
    </div>
  );
};

export default DeleteAccount;