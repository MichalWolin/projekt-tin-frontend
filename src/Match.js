import React from 'react';
import { useCookies } from 'react-cookie';

function Match({ match, managerId }) {
  const [cookies] = useCookies(['user']);

  const formatDate = (date) => {
    const dateObj = new Date(date);
    
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
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
        <th>{match.player_1_name} {match.player_1_surname}</th>
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
        <th>{match.player_2_name} {match.player_2_surname}</th>
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
  );
}

export default Match;