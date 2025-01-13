import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import Match from './Match';

function Profile() {
  const [cookies] = useCookies(['user']);
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState('');
  const [playerData, setPlayerData] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!loading) {
      if (!cookies.user || cookies.user.role !== "player" || cookies.user.id != id) {
        navigate("/");
      }
    }
  }, [cookies.user, cookies.user.id, loading]);

  useEffect(() => {
    fetch(`http://localhost:3000/players/profile/${id}`, {
      method: "GET"
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 404) {
        setErrorMessage("Użytkownik o podanym id nie istnieje lub nie jest graczem.");
        setLoading(false);
        return null;
      } else {
        setErrorMessage("Wystąpił nieoczekiwany błąd.");
        setLoading(false);
        return null;
      }
    })
    .then((data) => {
      if (data) {
        setPlayerData(data.user[0]);
        setLoading(false);
      }
    })
    .catch((error) => {
      console.log(error);
      setErrorMessage("Błąd połączenia z serwerem.")
    });
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:3000/players/matches/${id}?page=${page}`, {
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
        setMatches(data.matches);
        setHasNextPage(data.hasNextPage);
      } 
      
      if (data.matches.length === 0) {
        setErrorMessage("Brak meczów.");
      }
    })
    .catch((error) => {
      console.log(error);
      setErrorMessage('Błąd połączenia z serwerem.');
    });
  }, [page]);

  const formatDate = (date) => {
    const dateObj = new Date(date);
    
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}.${month}.${year}`;
  };

  if (loading) {
    return (
      <div className="div-align">
        <h2>Wczytywanie...</h2>
      </div>
    );
  }
  
  return (
    <div className="div-align">
      <p className="error-message">{errorMessage}</p>
      {playerData && 
        <>
          <h2>Witaj, {playerData.name}</h2>
          <table>
            <tr>
              <th>Imię</th>
              <th>Nazwisko</th>
              <th>Data urodzenia</th>
              <th>Punkty rankingowe</th>
            </tr>
            <tr>
              <td>{playerData.name}</td>
              <td>{playerData.surname}</td>
              <td>{formatDate(playerData.birthdate)}</td>
              <td>{playerData.points}</td>
            </tr>
          </table>
        </>
      }
      <h3>Twoje mecze</h3>
      {matches && matches.map((match) => 
        <Match match={match} />
      )}
      {!errorMessage &&
        <div>
          <button className="form-button" onClick={() => setPage(page - 1)} disabled={page === 1}>Poprzednia</button>
          <button className="form-button" onClick={() => setPage(page + 1)} disabled={!hasNextPage}>Następna</button>
        </div>
      }
    </div>
  );
}

export default Profile;