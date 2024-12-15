function Ranking() {
  return (
    <div className="div-align">
      <h2>Ranking</h2>
      <p>W tej sekcji znajdziesz rankingi graczy.</p>
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
        <tr>
          <td>1</td>
          <td>Iga</td>
          <td>Świątek</td>
          <td>31.05.2001</td>
          <td>10000</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Magda</td>
          <td>Linette</td>
          <td>12.02.1992</td>
          <td>9000</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Hubert</td>
          <td>Hurkacz</td>
          <td>11.02.1997</td>
          <td>8000</td>
        </tr>
      </table>
    </div>
  );
}

export default Ranking;