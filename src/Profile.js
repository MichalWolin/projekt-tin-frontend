import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';

function Profile() {
  const [cookies] = useCookies(['user']);
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState('');
  const [playerData, setPlayerData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/players/profile/${id}`, {
      method: "GET"
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 404) {
        setErrorMessage("Użytkownik o podanym id nie istnieje lub nie jest graczem.");
        return null;
      } else {
        setErrorMessage("Wystąpił nieoczekiwany błąd.");
        return null;
      }
    })
    .then((data) => {
      if (data) {
        setPlayerData(data.user[0]);
      }
    })
    .catch((error) => {
      console.log(error);
      setErrorMessage("Błąd połączenia z serwerem.")
    });
  }, [id]);

  const formatDate = (date) => {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}.${month}.${year}`;
  };
  
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
    </div>
  );
}

export default Profile;