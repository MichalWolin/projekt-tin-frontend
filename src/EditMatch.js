import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function EditMatch() {
  const { id } = useParams();
  const [cookies] = useCookies(['user']);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [tournamentId, setTournamentId] = useState('');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [date, setDate] = useState('');
  const [players, setPlayers] = useState(null);
  const [set1, setSet1] = useState('');
  const [set2, setSet2] = useState('');
  const [set3, setSet3] = useState('');
  const navigate = useNavigate();
  const [managerId, setManagerId] = useState('');
  const [loading, setLoading] = useState(true);
  const [tournamentStartDate, setTournamentStartDate] = useState('');
  const [tournamentEndDate, setTournamentEndDate] = useState('');
  const [player1Error, setPlayer1Error] = useState('');
  const [player2Error, setPlayer2Error] = useState('');
  const [dateError, setDateError] = useState('');
  const [set1Error, setSet1Error] = useState('');
  const [set2Error, setSet2Error] = useState('');
  const [set3Error, setSet3Error] = useState('');

  useEffect(() => {
    if (!loading) {
      if (!cookies.user || cookies.user.role !== "manager" || cookies.user.id !== managerId) {
        navigate("/");
      }
    }
  }, [loading, cookies.user, managerId]);

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
        setTournamentId(data.tournament_id);
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
    fetch(`http://localhost:3000/tournaments/${tournamentId}`, {
      method: "GET"
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        setErrorMessage("Wystąpił nieoczekiwany błąd.");
        setLoading(false);
        return null;
      }
    })
    .then((data) => {
      if (data) {
        setManagerId(data.manager_id);
        setTournamentStartDate(data.start_date);
        setTournamentEndDate(data.end_date);
      }
    })
    .catch((error) => {
      console.log(error);
      setErrorMessage('Błąd połączenia z serwerem.');
      setLoading(false);
    });
  }, [tournamentId]);

  useEffect(() => {
    if (tournamentId) {
      fetch(`http://localhost:3000/players/eligible/${tournamentId}`, {
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
    }
  }, [tournamentId]);

  useEffect(() => {
    if (tournamentId && managerId) {
      setLoading(false);
    }
  }, [tournamentId, managerId]);

  const validateSetScore = (set, setError) => {
    if (!/^[0-7]:[0-7]$/.test(set)) {
      setError("Niepoprawny format setu.");
      return false;
    }

    const [score1, score2] = set.split(":");
    if ((score1 == 6 && score2 <= 4 && score2 >= 0) || 
    (score1 <= 4 && score1 >= 0 && score2 == 6) || 
    (score1 == 7 && score2 == 5) || 
    (score1 == 5 && score2 == 7)) {

      return true;
    }

    setError("Niepoprawny wynik setu.");
    return false;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setPlayer1Error('');
    setPlayer2Error('');
    setDateError('');
    setSet1Error('');
    setSet2Error('');
    setSet3Error('');
    let error = false;

    if (player1 === player2) {
      setPlayer1Error("Zawodnicy muszą być różni.");
      setPlayer2Error("Zawodnicy muszą być różni.");
      error = true;
    }

    if (!player1 || player1 === "0") {
      setPlayer1Error("Zawodnik 1 jest wymagany.");
      error = true;
    }

    if (!player2 || player2 === "0") {
      setPlayer2Error("Zawodnik 2 jest wymagany.");
      error = true;
    }

    if (!date) {
      setDateError("Data meczu jest wymagana.");
      error = true;
    }

    const selectedDate = new Date(date);
    const tournamentStartDateObj = new Date(tournamentStartDate);
    const tournamentEndDateObj = new Date(tournamentEndDate);

    if (selectedDate < tournamentStartDateObj || selectedDate > tournamentEndDateObj) {
      setDateError(`Data meczu musi być pomiędzy ${formatDate(tournamentStartDate)} a ${formatDate(tournamentEndDate)}.`);
      error = true;
    }

    if (!validateSetScore(set1, setSet1Error)) {
      error = true;
    }

    if (!validateSetScore(set2, setSet2Error)) {
      error = true;
    }

    const [set1Player1, set1Player2] = set1.split(":");
    const [set2Player1, set2Player2] = set2.split(":");
    if ((set1Player1 > set1Player2 && set2Player1 > set2Player2) || set1Player1 < set1Player2 && set2Player1 < set2Player2) {
      if (set3) {
        setSet3Error("Trzeci set jest niedozwolony.");
        error = true;
      }
    } else {
      if (!validateSetScore(set3, setSet3Error)) {
        error = true;
      }
    }

    if (error) {
      return;
    }

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
        "set3": set3,
        "manager_id": managerId
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

  if (loading) {
    return (
      <div className="div-align">
        <h2>Wczytywanie...</h2>
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
        <p className="error-message">{player1Error}</p>
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
        <p className="error-message">{player2Error}</p>
        <label>Data meczu</label>
        <input type="date" value={formatDate(date)} onChange={handleDateChange} />
        <p className="error-message">{dateError}</p>
        <label>Set 1</label>
        <input type="text" value={set1} onChange={handleSet1Change} placeholder="0:0" />
        <p className="error-message">{set1Error}</p>
        <label>Set 2</label>
        <input type="text" value={set2} onChange={handleSet2Change} placeholder="0:0" />
        <p className="error-message">{set2Error}</p>
        <label>Set 3</label>
        <input type="text" value={set3} onChange={handleSet3Change} placeholder="0:0" />
        <p className="error-message">{set3Error}</p>
        <button className="form-button" onClick={handleSubmit}>Zapisz zmiany</button>
      </form>
      <p className="error-message">{errorMessage}</p>
      <p className="success-message">{successMessage}</p>
    </div>
  );
}

export default EditMatch;