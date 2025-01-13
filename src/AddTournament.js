import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

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
      setNameError("Nazwa turnieju musi zawierać co najmniej 3 znaki.");
      error = true;
    }

    if (name.length > 255) {
      setNameError("Nazwa turnieju nie może zawierać więcej niż 255 znaków.");
      error = true;
    }

    if (/\s/.test(name)) {
      setNameError("Nazwa turnieju nie może zawierać spacji.");
      error = true;
    }

    if (!startDate) {
      setStartDateError("Data rozpoczęcia turnieju jest wymagana.");
      error = true;
    }

    if (!endDate) {
      setEndDateError("Data zakończenia turnieju jest wymagana.");
      error = true;
    }

    if (/\s/.test(startDate)) {
      setStartDateError("Data rozpoczęcia turnieju nie może zawierać spacji.");
      error = true;
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (startDateObj < new Date()) {
      setStartDateError("Data rozpoczęcia turnieju nie może być w przeszłości.");
      error = true;
    }

    if (startDateObj > endDateObj) {
      setEndDateError("Data zakończenia turnieju nie może być wcześniejsza niż data rozpoczęcia.");
      error = true;
    }

    if (endDateObj - startDateObj < 24 * 60 * 60 * 1000) {
      setEndDateError("Turniej musi trwać co najmniej 1 dzień.");
      error = true;
    }

    if (endDateObj - startDateObj > 24 * 60 * 60 * 1000 * 14) {
      setEndDateError("Turniej nie może trwać dłużej niż 14 dni.");
      error = true;
    }

    if (gender !== "male" && gender !== "female") {
      setGenderError("Nieprawidłowa płeć.");
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
        setSuccessMessage("Pomyślnie dodano turniej.");
        setName('');
        setStartDate('');
        setEndDate('');
        setGender('male');
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
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
        <p className="error-message">{nameError}</p>
        <label>Data rozpoczęcia</label>
        <input type="date" value={formatDate(startDate)} onChange={handleStartDateChange} />
        <p className="error-message">{startDateError}</p>
        <label>Data zakończenia</label>
        <input type="date" value={formatDate(endDate)} onChange={handleEndDateChange} />
        <p className="error-message">{endDateError}</p>
        <label>Płeć</label>
        <select name="gender" onChange={handleGenderChange}>
          <option value="male">Mężczyzna</option>
          <option value="female">Kobieta</option>
        </select>
        <p className="error-message">{genderError}</p>
        <button className="form-button" onClick={handleSubmit}>Dodaj turniej</button>
        <p className="error-message">{errorMessage}</p>
        <p className="success-message">{successMessage}</p>
      </form>
    </div>
  );
}

export default AddTournament;