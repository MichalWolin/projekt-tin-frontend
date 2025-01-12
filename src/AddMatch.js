import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';

function AddMatch() {
  const { id } = useParams();
  const [cookies] = useCookies(['user']);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [date, setDate] = useState('');
  const [players, setPlayers] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/players/eligible/${id}`, {
      method: "GET"
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        setErrorMessage("Wystąpił nieoczekiwany błąd.");
        return null;
      }
    })
    .then((data) => {
      if (data) {
        setPlayers(data.players);
      }
    })
    .catch((error) => {
      console.log(error);
      setErrorMessage('Błąd połączenia z serwerem.');
    });
  });

  const handlePlayer1Change = (event) => {
    setPlayer1(event.target.value);
  };

  const handlePlayer2Change = (event) => {
    setPlayer2(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
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
    fetch(`http://localhost:3000/matches/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "player_1_id": player1,
        "player_2_id": player2,
        "date": date
      })
    })
    .then(response => {
      if (response.status === 201) {
        setSuccessMessage("Pomyślnie dodano mecz.");
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
      <h2>Dodawanie meczu</h2>
      <form>
        <label>Zawodnik 1</label>
        <select value={player1} onChange={handlePlayer1Change}>
          <option value="0">Wybierz zawodnika</option>
          {players && 
            players.filter(player => player.id != player2)
            .map(player => (
              <option key={player.id} value={player.id}>{player.name} {player.surname}</option>
            ))
          }
        </select>
        <label>Zawodnik 2</label>
        <select value={player2} onChange={handlePlayer2Change}>
          <option value="0">Wybierz zawodnika</option>
          {players && 
            players.filter(player => player.id != player1)
            .map(player => (
              <option key={player.id} value={player.id}>{player.name} {player.surname}</option>
            ))
          }
        </select>
        <label>Data meczu</label>
        <input type="date" value={formatDate(date)} onChange={handleDateChange} />
        <button className="form-button" onClick={handleSubmit}>Dodaj mecz</button>
      </form>
      <p className="error-message">{errorMessage}</p>
      <p className="success-message">{successMessage}</p>
    </div>
  );
}

export default AddMatch;