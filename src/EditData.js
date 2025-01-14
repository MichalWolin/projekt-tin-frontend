import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import pl from './locales/pl.json';
import en from './locales/en.json';

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
  const translations = cookies.user && cookies.user.language === 'polish' ? pl : en;

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
        setErrorMessage(translations.user_doesnt_exist);
        return null;
      } else {
        setErrorMessage(translations.unexpected_error);
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
      setErrorMessage(translations.connection_error);
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
      setEmailError(translations.field_required);
      error = true;
    }

    if (!/^[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+$/.test(email)) {
      setEmailError(translations.invalid_email);
      error = true;
    }

    if (cookies.user.role === "player") {
      if (name === '') {
        setNameError(translations.field_required);
        error = true;
      }
  
      if (surname === '') {
        setSurnameError(translations.field_required);
        error = true;
      }
  
      if (birthdate === '') {
        setBirthdateError(translations.field_required);
        error = true;
      }
  
      if (name.length < 3 || name.length > 255) {
        setNameError(translations.name_length);
        error = true;
      }
  
      if (/\s/.test(name)) {
        setNameError(translations.no_spaces);
        error = true;
      }
  
      if (surname.length < 3 || surname.length > 255) {
        setSurnameError(translations.surname_length);
        error = true;
      }
  
      if (/\s/.test(surname)) {
        setSurnameError(translations.no_spaces);
        error = true;
      }
  
      const birthdateObj = new Date(birthdate);
  
      if (birthdateObj > new Date()) {
        setBirthdateError(translations.birthdate_not_future);
        error = true;
      }
  
      if (new Date() - birthdateObj < 24 * 60 * 60 * 1000 * 365 * 16) {
        setBirthdateError(translations.at_least_16);
        error = true;
      }
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
        setSuccessMessage(translations.data_success);
      } else if (response.status === 404) {
        setErrorMessage(translations.user_doesnt_exist);
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
      <p className="error-message">{errorMessage}</p>
      {!errorMessage &&
        <div className="div-align">
          <h2>{translations.edit_data}</h2>
          <form>
            <label>E-mail</label>
            <input type="email" value={email} onChange={handleEmailChange} />
            <p className="error-message">{emailError}</p>
            {cookies.user.role === "player" &&
              <>
                <label>{translations.name}</label>
                <input type="text" value={name} onChange={handleNameChange} />
                <p className="error-message">{nameError}</p>
                <label>{translations.surname}</label>
                <input type="text" value={surname} onChange={handleSurnameChange} />
                <p className="error-message">{surnameError}</p>
                <label>{translations.birthdate}</label>
                <input type="date" value={formatDate(birthdate)} onChange={handleBirthdateChange} />
                <p className="error-message">{birthdateError}</p>
              </>
            }
            <button className="form-button" onClick={handleSubmit}>{translations.save}</button>
            <p className="success-message">{successMessage}</p>
          </form>
        </div>
      }
    </div>
  );
}

export default EditData;