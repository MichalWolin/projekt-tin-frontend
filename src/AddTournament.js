import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

function AddTournament() {
  const [cookies] = useCookies(['user']);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [gender, setGender] = useState('male');

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
    //TODO: Walidacja :)
    setErrorMessage('');
    setSuccessMessage('');
    event.preventDefault();
    fetch("http://localhost:3000/tournaments", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": name,
        "start_date": startDate,
        "end_date": endDate,
        "manager_id": cookies.user.id,
        "gender": gender
      })
    })
    .then(response => {
      if (response.status === 201) {
        setSuccessMessage("Pomyślnie dodano turniej.");
      } else {
        setErrorMessage("Wystąpił nieoczekiwany błąd.");
      }
    })
    .catch((error) => {
      console.log(error);
      setErrorMessage("Błąd połączenia z serwerem.");
    });
  };

  return (
    <div className="div-align">
      <h2>Dodawanie nowego turnieju</h2>
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
        <button className="form-button" onClick={handleSubmit}>Dodaj turniej</button>
        <p className="error-message">{errorMessage}</p>
        <p className="success-message">{successMessage}</p>
      </form>
    </div>
  );
}

export default AddTournament;