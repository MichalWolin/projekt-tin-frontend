import React, { useState, useEffect} from 'react';

function Tournaments() {
  const [errorMessage, setErrorMessage] = useState('');
  const [tournaments, setTournaments] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
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
  }, [page]);

  const formatDate = (date) => {
    const dateObj = new Date(date);
    
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="div-align">
      <h2>Nadchodzące turnieje</h2>
      <p className="error-message">{errorMessage}</p>
      {tournaments && 
        <>
          {tournaments.map((tournament) => (
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
          ))}
          <button className="form-button" onClick={() => setPage(page - 1)} disabled={page === 1}>Poprzednia</button>
          <button className="form-button" onClick={() => setPage(page + 1)} disabled={!hasNextPage}>Następna</button>
        </>
      }
    </div>
  );
}

export default Tournaments;