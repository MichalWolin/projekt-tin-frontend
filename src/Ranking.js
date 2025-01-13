import React, { useEffect, useState } from "react";

function Ranking() {
  const [ranking, setRanking] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3000/players/ranking?page=${page}`, {
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
        setRanking(data.players);
        setHasNextPage(data.hasNextPage);
      }

      if (data.players.length === 0) {
        setErrorMessage("Brak wyników.");
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

  return (
    <div className="div-align">
      <table>
        <tr>
          <th colSpan="5">Ranking</th>
        </tr>
        <tr>
          <th>Pozycja</th>
          <th>Imię</th>
          <th>Nazwisko</th>
          <th>Data urodzenia</th>
          <th>Punkty</th>
        </tr>
        {ranking && ranking.map((player, index) => (
          <tr key={player.id}>
            <td>{(page - 1) * 2 + index + 1}</td>
            <td>{player.name}</td>
            <td>{player.surname}</td>
            <td>{formatDate(player.birthdate)}</td>
            <td>{player.points}</td>
          </tr>
        ))}
      </table>
      {!errorMessage &&
        <div>
          <button className="form-button" onClick={() => setPage(page - 1)} disabled={page === 1}>Poprzednia</button>
          <button className="form-button" onClick={() => setPage(page + 1)} disabled={!hasNextPage}>Następna</button>
        </div>
      }
    </div>
  );
}

export default Ranking;