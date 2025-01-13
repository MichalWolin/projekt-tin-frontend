import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

function EditData() {
  const [cookies] = useCookies(['user']);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [surnameError, setSurnameError] = useState('');
  const [birthdateError, setBirthdateError] = useState('');

  useEffect(() => {
    if (!cookies.user || (cookies.user.role !== "manager" && cookies.user.role !== "player")) {
      navigate("/");
    }
  }, [cookies.user]);

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
        setEmail(data.email);
        setName(data.name);
        setSurname(data.surname);
        setBirthdate(data.birthdate);
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
    setErrorMessage('');
    setEmailError('');
    setNameError('');
    setSurnameError('');
    setBirthdateError('');
    let error = false;

    if (email === '') {
      setEmailError('To pole jest wymagane.');
      error = true;
    }

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

    if (!/^[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+$/.test(email)) {
      setEmailError('Niepoprawny format adresu e-mail.');
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

    if (error) {
      return;
    }

    fetch(`http://localhost:3000/users/data/${cookies.user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "email": email,
        "name": name,
        "surname": surname,
        "birthdate": formatDate(birthdate),
        "user_id": cookies.user.id,
        "role": cookies.user.role
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
        <div className="div-align">
          <h2>Edytuj dane</h2>
          <form>
            <label>E-mail</label>
            <input type="email" value={email} onChange={handleEmailChange} />
            <p className="error-message">{emailError}</p>
            {cookies.user.role === "player" &&
              <>
                <label>Imię</label>
                <input type="text" value={name} onChange={handleNameChange} />
                <p className="error-message">{nameError}</p>
                <label>Nazwisko</label>
                <input type="text" value={surname} onChange={handleSurnameChange} />
                <p className="error-message">{surnameError}</p>
                <label>Data urodzenia</label>
                <input type="date" value={formatDate(birthdate)} onChange={handleBirthdateChange} />
                <p className="error-message">{birthdateError}</p>
              </>
            }
            <button className="form-button" onClick={handleSubmit}>Zapisz zmiany</button>
            <p className="success-message">{successMessage}</p>
          </form>
        </div>
      }
    </div>
  );
}

export default EditData;