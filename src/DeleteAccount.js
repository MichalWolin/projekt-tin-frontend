import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

function DeleteAccount() {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

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
        setSuccessMessage('Konto zostało usunięte.');
        setTimeout(() => {
          removeCookie('user', { path: '/' });
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