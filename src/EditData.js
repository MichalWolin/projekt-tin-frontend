import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

function EditData() {
  const [cookies] = useCookies(['user']);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [birthdate, setBirthdate] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3000/users/data/${cookies.user.id}`, {
      method: "GET"
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 404) {
        setErrorMessage("Użytkownik o podanym id nie istnieje.");
        return null;
      } else {
        setErrorMessage("Wystąpił nieoczekiwany błąd.");
        return null;
      }
    })
    .then((data) => {
      if (data) {
        setEmail(data.user[0].email);
        setName(data.user[0].name);
        setSurname(data.user[0].surname);
        setBirthdate(data.user[0].birthdate);
      }
    })
    .catch((error) => {
      console.log(error);
      setErrorMessage("Błąd połączenia z serwerem.")
    });
  }, [cookies.user.id]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
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

  const formatDate = (date) => {
    const dateObj = new Date(date);
    
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSuccessMessage('');
    fetch(`http://localhost:3000/users/data/${cookies.user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        name: name,
        surname: surname,
        birthdate: formatDate(birthdate)
      })
    })
    .then(response => {
      if (response.status === 200) {
        setSuccessMessage("Pomyślnie zaktualizowano dane.");
      } else if (response.status === 404) {
        setErrorMessage("Użytkownik o podanym id nie istnieje.");
      } else {
        setErrorMessage("Wystąpił nieoczekiwany błąd.");
      }
    })
    .catch((error) => {
      console.log(error);
      setErrorMessage("Błąd połączenia z serwerem.")
    });
  };

  return (
    <div className="div-align">
      <p className="error-message">{errorMessage}</p>
      {!errorMessage &&
        <>
          <h2>Edytuj dane</h2>
          <form>
            <label>E-mail</label>
            <input type="email" value={email} onChange={handleEmailChange} />
            {cookies.user.role === "player" &&
              <>
                <label>Imię</label>
                <input type="text" value={name} onChange={handleNameChange} />
                <label>Nazwisko</label>
                <input type="text" value={surname} onChange={handleSurnameChange} />
                <label>Data urodzenia</label>
                <input type="date" value={formatDate(birthdate)} onChange={handleBirthdateChange} />
              </>
            }
            <button className="form-button" onClick={handleSubmit}>Zapisz zmiany</button>
            <p className="success-message">{successMessage}</p>
          </form>
        </>
      }
    </div>
  );
}

export default EditData;