import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import Match from './Match';

function Matches() {
  const { id } = useParams();
  const [cookies] = useCookies(['user']);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [matches, setMatches] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setPage] = useState(1);
  const [managerId, setManagerId] = useState(null);
  const navigate = useNavigate();

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
    .catch((error) => {
      console.log(error);
      setErrorMessage('Błąd połączenia z serwerem.');
    });
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

  const handleAddMatch = () => {
    navigate(`/tournaments/add-match/${id}`);
  };

  const handleRemoveMatch = (id) => {
    fetch(`http://localhost:3000/matches/${id}`, {
      method: "DELETE"
    })
    .then(response => {
      if (response.status === 200) {
        setSuccessMessage("Mecz został usunięty.");
        fetchMatches();
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
      <h2>Mecze</h2>
      <p className="error-message">{errorMessage}</p>
      {matches &&
        <>
          {matches.map((match) => (
            <Match match={match} managerId={managerId} handleRemoveMatch={handleRemoveMatch} />
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
          <button className="form-button" onClick={handleAddMatch}>Dodaj mecz</button>
        </>
      }
      <p className="success-message">{successMessage}</p>
    </div>
  );
}

export default Matches;