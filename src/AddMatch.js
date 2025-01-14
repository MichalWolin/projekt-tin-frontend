import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import pl from './locales/pl.json';
import en from './locales/en.json';

function AddMatch() {
  const { id } = useParams();
  const [cookies] = useCookies(['user']);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [date, setDate] = useState('');
  const [players, setPlayers] = useState(null);
  const navigate = useNavigate();
  const [managerId, setManagerId] = useState('');
  const [loading, setLoading] = useState(true);
  const [tournamentStartDate, setTournamentStartDate] = useState('');
  const [tournamentEndDate, setTournamentEndDate] = useState('');
  const [player1Error, setPlayer1Error] = useState('');
  const [player2Error, setPlayer2Error] = useState('');
  const [dateError, setDateError] = useState('');
  const translations = cookies.user && cookies.user.language === 'polish' ? pl : en;

  useEffect(() => {
    if (!loading) {
      if (!cookies.user || cookies.user.role !== "manager" || cookies.user.id !== managerId) {
        navigate("/");
      }
    }
  }, [loading, cookies.user, managerId]);

  useEffect(() => {
    fetch(`http://localhost:3000/tournaments/${id}`, {
      method: "GET"
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        setErrorMessage(translations.unexpected_error);
        setLoading(false);
        return null;
      }
    })
    .then((data) => {
      if (data) {
        setManagerId(data.manager_id);
        setTournamentStartDate(data.start_date);
        setTournamentEndDate(data.end_date);
        setLoading(false);
      }
    })
    .catch((error) => {
      console.log(error);
      setErrorMessage(translations.connection_error);
      setLoading(false);
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
        setErrorMessage(translations.unexpected_error);
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
      setErrorMessage(translations.connection_error);
    });
  }, [id]);

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
    event.preventDefault();
    setSuccessMessage('');
    setPlayer1Error('');
    setPlayer2Error('');
    setDateError('');
    let error = false;

    if (player1 === player2) {
      setPlayer1Error(translations.different_players);
      setPlayer2Error(translations.different_players);
      error = true;
    }

    if (!player1 || player1 === "0") {
      setPlayer1Error(translations.player_1_required);
      error = true;
    }

    if (!player2 || player2 === "0") {
      setPlayer2Error(translations.player_2_required);
      error = true;
    }

    if (!date) {
      setDateError(translations.match_date_required);
      error = true;
    }

    const selectedDate = new Date(date);
    const tournamentStartDateObj = new Date(tournamentStartDate);
    const tournamentEndDateObj = new Date(tournamentEndDate);

    if (selectedDate < tournamentStartDateObj || selectedDate > tournamentEndDateObj) {
      setDateError(`${translations.match_date_invalid} ${formatDate(tournamentStartDate)} - ${formatDate(tournamentEndDate)}.`);
      error = true;
    }

    if (error) {
      return;
    }

    fetch(`http://localhost:3000/matches/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "player_1_id": player1,
        "player_2_id": player2,
        "date": date,
        "manager_id": cookies.user.id
      })
    })
    .then(response => {
      if (response.status === 201) {
        setSuccessMessage(translations.add_match_success);
        setPlayer1('');
        setPlayer2('');
        setDate('');
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

  if (loading) {
    return (
      <div className="div-align">
        <h2>{translations.loading}</h2>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="div-align">
        <p className="error-message">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="div-align">
      <h2>{translations.adding_match}</h2>
      <form>
        <label>{translations.player_1}</label>
        <select value={player1} onChange={handlePlayer1Change}>
          <option value="0">{translations.choose_player}</option>
          {players && 
            players.filter(player => player.id != player2)
            .map(player => (
              <option key={player.id} value={player.id}>{player.name} {player.surname}</option>
            ))
          }
        </select>
        <p className="error-message">{player1Error}</p>
        <label>{translations.player_2}</label>
        <select value={player2} onChange={handlePlayer2Change}>
          <option value="0">{translations.choose_player}</option>
          {players && 
            players.filter(player => player.id != player1)
            .map(player => (
              <option key={player.id} value={player.id}>{player.name} {player.surname}</option>
            ))
          }
        </select>
        <p className="error-message">{player2Error}</p>
        <label>{translations.match_date}</label>
        <input type="date" value={formatDate(date)} onChange={handleDateChange} />
        <p className="error-message">{dateError}</p>
        <button className="form-button" onClick={handleSubmit}>{translations.add_match}</button>
      </form>
      <p className="success-message">{successMessage}</p>
    </div>
  );
}

export default AddMatch;