import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function EditTournament() {
  const { id } = useParams();
  const [cookies] = useCookies(['user']);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [gender, setGender] = useState('male');
  const [managerId, setManagerId] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3000/tournaments/${id}`, {
      method: "GET"
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 404) {
        setErrorMessage("Turniej o podanym id nie istnieje.");
        return null;
      } else {
        setErrorMessage("Wystąpił nieoczekiwany błąd.");
        return null;
      }
    })
    .then((tournament) => {
      if (tournament) {
        setName(tournament.name);
        setStartDate(tournament.start_date);
        setEndDate(tournament.end_date);
        setGender(tournament.gender);
        setManagerId(tournament.manager_id);
      }
    })
    .catch((error) => {
      console.log(error);
      setErrorMessage("Błąd połączenia z serwerem.")
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
    setErrorMessage('');
    setSuccessMessage('');
    event.preventDefault();
    fetch(`http://localhost:3000/tournaments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "name": name,
        "start_date": formatDate(startDate),
        "end_date": formatDate(endDate),
        "gender": gender
      })
    })
    .then(response => {
      if (response.status === 200) {
        setSuccessMessage("Pomyślnie zaktualizowane dane.");
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
      {cookies.user && cookies.user.id === managerId ? (
        <>
          <h2>Edytuj turniej</h2>
          <form>
            <label>Nazwa turnieju</label>
            <input type="text" placeholder="Nazwa turnieju" value={name} onChange={handleNameChange} />
            <label>Data rozpoczęcia</label>
            <input type="date" value={formatDate(startDate)} onChange={handleStartDateChange} />
            <label>Data zakończenia</label>
            <input type="date" value={formatDate(endDate)} onChange={handleEndDateChange} />
            <label>Płeć</label>
            <select name="gender" onChange={handleGenderChange}>
              <option value="male">Mężczyzna</option>
              <option value="female">Kobieta</option>
            </select>
            <button className="form-button" onClick={handleSubmit}>Zapisz zmiany</button>
            <p className="error-message">{errorMessage}</p>
            <p className="success-message">{successMessage}</p>
          </form>
        </>
      ) : (
        <p className='error-message'>Nie masz uprawnień do edycji tego turnieju.</p>
      )}
    </div>
  );
}

export default EditTournament;