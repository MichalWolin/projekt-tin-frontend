import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import pl from './locales/pl.json';
import en from './locales/en.json';

function AddTournament() {
  const [cookies] = useCookies(['user']);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [gender, setGender] = useState('male');
  const navigate = useNavigate();
  const [nameError, setNameError] = useState('');
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');
  const [genderError, setGenderError] = useState('');
  const translations = cookies.user && cookies.user.language === 'polish' ? pl : en;

  useEffect(() => {
    if (!cookies.user || cookies.user.role !== "manager") {
      navigate("/");
    }
  }, [cookies.user]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
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
    setErrorMessage('');
    setSuccessMessage('');
    setNameError('');
    setStartDateError('');
    setEndDateError('');
    setGenderError('');
    let error = false;

    if (name.length < 3) {
      setNameError(translations.tournament_name_too_short);
      error = true;
    }

    if (name.length > 255) {
      setNameError(translations.tournament_name_too_long);
      error = true;
    }

    if (/\s/.test(name)) {
      setNameError(translations.tournament_name_no_spaces);
      error = true;
    }

    if (!startDate) {
      setStartDateError(translations.start_date_required);
      error = true;
    }

    if (!endDate) {
      setEndDateError(translations.end_date_required);
      error = true;
    }

    if (/\s/.test(startDate)) {
      setStartDateError(translations.start_date_no_spaces);
      error = true;
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (startDateObj < new Date()) {
      setStartDateError(translations.start_date_not_past);
      error = true;
    }

    if (startDateObj > endDateObj) {
      setEndDateError(translations.end_date_before_start_date);
      error = true;
    }

    if (endDateObj - startDateObj < 24 * 60 * 60 * 1000) {
      setEndDateError(translations.tournament_min_duration);
      error = true;
    }

    if (endDateObj - startDateObj > 24 * 60 * 60 * 1000 * 14) {
      setEndDateError(translations.tournament_max_duration);
      error = true;
    }

    if (gender !== "male" && gender !== "female") {
      setGenderError(translations.wrong_gender);
      error = true;
    }

    if (error) {
      return;
    }

    fetch("http://localhost:3000/tournaments", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "tournament_name": name,
        "start_date": startDate,
        "end_date": endDate,
        "manager_id": cookies.user.id,
        "gender": gender
      })
    })
    .then(response => {
      if (response.status === 201) {
        setSuccessMessage(translations.add_tournament_success);
        setName('');
        setStartDate('');
        setEndDate('');
        setGender('male');
        setTimeout(() => {
          setSuccessMessage('');
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
      <h2>{translations.adding_tournament}</h2>
      <form>
        <label>{translations.tournament_name}</label>
        <input type="text" value={name} onChange={handleNameChange} />
        <p className="error-message">{nameError}</p>
        <label>{translations.start_date}</label>
        <input type="date" value={formatDate(startDate)} onChange={handleStartDateChange} />
        <p className="error-message">{startDateError}</p>
        <label>{translations.end_date}</label>
        <input type="date" value={formatDate(endDate)} onChange={handleEndDateChange} />
        <p className="error-message">{endDateError}</p>
        <label>{translations.gender}</label>
        <select name="gender" onChange={handleGenderChange}>
          <option value="male">{translations.man}</option>
          <option value="female">{translations.woman}</option>
        </select>
        <p className="error-message">{genderError}</p>
        <button className="form-button" onClick={handleSubmit}>{translations.add_tournament}</button>
        <p className="error-message">{errorMessage}</p>
        <p className="success-message">{successMessage}</p>
      </form>
    </div>
  );
}

export default AddTournament;