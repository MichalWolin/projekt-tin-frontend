import React, { use, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function EditMatch() {
  const { id } = useParams();
  const [cookies] = useCookies(['user']);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [date, setDate] = useState('');
  const [players, setPlayers] = useState(null);
  const [set1, setSet1] = useState('');
  const [set2, setSet2] = useState('');
  const [set3, setSet3] = useState('');

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

  const handleSet1Change = (event) => {
    setSet1(event.target.value);
  };

  const handleSet2Change = (event) => {
    setSet2(event.target.value);
  };

  const handleSet3Change = (event) => {
    setSet3(event.target.value);
  };

  useEffect(() => {
    fetch(`http://localhost:3000/matches/match/${id}`, {
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
        setPlayer1(data.player_1_id);
        setPlayer2(data.player_2_id);
        setDate(data.date);
        
        if (data.set1) {
          setSet1(data.set1);
        }
        if (data.set2) {
          setSet2(data.set2);
        }
        if (data.set3) {
          setSet3(data.set3);
        }
      }
    })
    .catch((error) => {
      console.log(error);
      setErrorMessage('Błąd połączenia z serwerem.');
    });
  }, [id]);

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
  }, [id]);

  const handleSubmit = (event) => {
    setErrorMessage('');
    setSuccessMessage('');
    event.preventDefault();
    fetch(`http://localhost:3000/matches/match/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "player_1_id": player1,
        "player_2_id": player2,
        "date": formatDate(date),
        "set1": set1,
        "set2": set2,
        "set3": set3
      })
    })
    .then(response => {
      if (response.status === 200) {
        setSuccessMessage("Mecz został zaktualizowany.");
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
      <h2>Edytuj mecz</h2>
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
        <label>Set 1</label>
        <input type="text" value={set1} onChange={handleSet1Change} placeholder="0:0" />
        <label>Set 2</label>
        <input type="text" value={set2} onChange={handleSet2Change} placeholder="0:0" />
        <label>Set 3</label>
        <input type="text" value={set3} onChange={handleSet3Change} placeholder="0:0" />
        <button className="form-button" onClick={handleSubmit}>Zapisz zmiany</button>
      </form>
      <p className="error-message">{errorMessage}</p>
      <p className="success-message">{successMessage}</p>
    </div>
  );
}

export default EditMatch;