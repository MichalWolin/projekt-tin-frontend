import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';

function Matches() {
  const { id } = useParams();
  const [cookies] = useCookies(['user']);
  const [errorMessage, setErrorMessage] = useState('');
  const [matches, setMatches] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setPage] = useState(1);
  const [managerId, setManagerId] = useState(null);

  const fetchMatches = () => {
    fetch(`http://localhost:3000/matches/${id}?page=${page}`, {
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
  };

  const fetchManagerId = () => {
    fetch(`http://localhost:3000/tournaments/manager/${id}`, {
      method: "GET"
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 404) {
        setErrorMessage("Nie znaleziono turnieju.");
        return null;
      } else {
        setErrorMessage("Wystąpił nieoczekiwany błąd.");
        return null;
      }
    })
    .then((data) => {
      if (data) {
        setManagerId(data.manager_id);
      }
    })
    .catch((error) => {
      console.log(error);
      setErrorMessage('Błąd połączenia z serwerem.');
    });
  };

  useEffect(() => {
    fetchMatches();
  }, [page]);

  useEffect(() => {
    fetchManagerId();
  }, []);

  const formatDate = (date) => {
    const dateObj = new Date(date);
    
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="div-align">
      <h2>Mecze</h2>
      <p className="error-message">{errorMessage}</p>
      {matches &&
        <>
          {/* Pytania: Czy to do oddzielnego komponentu? */}
          {matches.map((match) => (
            <div key={match.id} className="div-align">
              <table>
                <tr>
                  <th>Data</th>
                  <th>Zawodnicy</th>
                  <th>Set 1</th>
                  <th>Set 2</th>
                  <th>Set 3</th>
                </tr>
                <tr>
                  <td rowspan="2">{formatDate(match.date)}</td>
                  <th>{match.player_1_id}</th>
                  {match.set1 &&
                    <>
                      <td>{match.set1.split(':')[0]}</td>
                      <td>{match.set2.split(':')[0]}</td>
                      <td>{match.set3.split(':')[0]}</td>
                    </>
                  }
                  {!match.set1 &&
                    <td rowspan="2" colspan="3">Mecz się jeszcze nie odbył</td>
                  }
                </tr>
                <tr>
                  <th>{match.player_2_id}</th>
                  {match.set1 &&
                    <>
                      <td>{match.set1.split(':')[1]}</td>
                      <td>{match.set2.split(':')[1]}</td>
                      <td>{match.set3.split(':')[1]}</td>
                    </>
                  }
                </tr>
              </table>
              {cookies.user && cookies.user.role === 'manager' && managerId === cookies.user.id &&
                <div>
                  <button className="form-button">Edytuj mecz</button>
                  <button className="form-button">Usuń mecz</button>
                </div>
              }
            </div>
          ))}
          {!errorMessage &&
            <div>
              <button className="form-button" onClick={() => setPage(page - 1)} disabled={page === 1}>Poprzednia</button>
              <button className="form-button" onClick={() => setPage(page + 1)} disabled={!hasNextPage}>Następna</button>
            </div>
          }
        </>
      }
      {cookies.user && cookies.user.role === 'manager' &&
        <>
          <button className="form-button">Dodaj mecz</button>
        </>
      }
      {/* <p className="success-message">{successMessage}</p> */}
    </div>
  );
}

export default Matches;