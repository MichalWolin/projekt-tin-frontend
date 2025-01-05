import React, { useState, useEffect} from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

function Tournaments() {
  const [cookies] = useCookies(['user']);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [tournaments, setTournaments] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchTournaments = () => {
    fetch(`http://localhost:3000/tournaments?page=${page}`, {
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
        setTournaments(data.tournaments);
        setHasNextPage(data.hasNextPage);
      } else {
        setErrorMessage("Brak nadchodzących turniejów.");
      }
    })
  };

  useEffect(() => {
    fetchTournaments();
  }, [page]);

  const formatDate = (date) => {
    const dateObj = new Date(date);
    
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleAddTournament = () => {
    navigate('/tournaments/add-tournament');
  };

  const handleRemoveTournament = (id) => {
    fetch(`http://localhost:3000/tournaments/${id}`, {
      method: "DELETE"
    })
    .then(response => {
      if (response.status === 200) {
        setSuccessMessage('Turniej został usunięty.');
        fetchTournaments();
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        setErrorMessage('Wystąpił nieoczekiwany błąd.');
      }
    })
    .catch((error) => {
      console.log(error);
      setErrorMessage('Błąd połączenia z serwerem.');
    });
  };

  const handleEditTournament = (id) => {
    navigate(`/tournaments/edit-tournament/${id}`);
  };

  return (
    <div className="div-align">
      <h2>Nadchodzące turnieje</h2>
      <p className="error-message">{errorMessage}</p>
      {tournaments && 
        <>
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="div-align">
              <table>
                <tr>
                  <th>Nazwa</th>
                  <th>Data rozpoczęcia</th>
                  <th>Data zakończenia</th>
                  <th>Płeć</th>
                </tr>
                <tr>
                  <td>{tournament.name}</td>
                  <td>{formatDate(tournament.start_date)}</td>
                  <td>{formatDate(tournament.end_date)}</td>
                  <td>{tournament.gender}</td>
                </tr>
              </table>
              <div>
                <button className="form-button">Mecze</button>
                {cookies.user && cookies.user.role === 'player' &&
                  <button className="form-button">Zapisz się</button>
                }
                {cookies.user && cookies.user.role === 'manager' && cookies.user.id === tournament.manager_id &&
                  <>
                    <button className="form-button" onClick={() => handleEditTournament(tournament.id)}>Edytuj</button>
                    <button className="form-button" onClick={() => handleRemoveTournament(tournament.id)}>Usuń</button>
                  </>
                }
              </div>
            </div>
          ))}
          <div>
            <button className="form-button" onClick={() => setPage(page - 1)} disabled={page === 1}>Poprzednia</button>
            <button className="form-button" onClick={() => setPage(page + 1)} disabled={!hasNextPage}>Następna</button>
          </div>
        </>
      }
      {cookies.user && cookies.user.role === 'manager' &&
        <>
          <button className="form-button" onClick={handleAddTournament}>Dodaj turniej</button>
        </>
      }
      <p className="success-message">{successMessage}</p>
    </div>
  );
}

export default Tournaments;