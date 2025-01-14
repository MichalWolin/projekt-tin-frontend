import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import pl from './locales/pl.json';
import en from './locales/en.json';

function EditTournament() {
  const { id } = useParams();
  const [cookies] = useCookies(['user']);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [managerId, setManagerId] = useState('');
  const [nameError, setNameError] = useState('');
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');
  const translations = cookies.user && cookies.user.language === 'polish' ? pl : en;

  useEffect(() => {
    fetch(`http://localhost:3000/tournaments/${id}`, {
      method: "GET"
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 404) {
        setErrorMessage(translations.tournament_doesnt_exist);
        return null;
      } else {
        setErrorMessage(translations.unexpected_error);
        return null;
      }
    })
    .then((tournament) => {
      if (tournament) {
        setName(tournament.name);
        setStartDate(tournament.start_date);
        setEndDate(tournament.end_date);
        setManagerId(tournament.manager_id);
      }
    })
    .catch((error) => {
      console.log(error);
      setErrorMessage(translations.connection_error);
    });
  }, [id]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
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

    if (error) {
      return;
    }

    fetch(`http://localhost:3000/tournaments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "tournament_name": name,
        "start_date": formatDate(startDate),
        "end_date": formatDate(endDate),
        "manager_id": managerId
      })
    })
    .then(response => {
      if (response.status === 200) {
        setSuccessMessage(translations.tournament_edit_success);
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
      {cookies.user && cookies.user.id === managerId ? (
        <>
          <h2>{translations.edit_tournament}</h2>
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
            <button className="form-button" onClick={handleSubmit}>{translations.save}</button>
            <p className="error-message">{errorMessage}</p>
            <p className="success-message">{successMessage}</p>
          </form>
        </>
      ) : (
        <p className='error-message'>{translations.no_permission_edit_tournament}</p>
      )}
    </div>
  );
}

export default EditTournament;