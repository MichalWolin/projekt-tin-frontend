function Tournaments() {
  return (
    <div className="div-align">
    <h2>Nadchodzące turnieje</h2>
    <table>
        <tr>
          <th>Nazwa</th>
          <th>Data rozpoczęcia</th>
          <th>Data zakończenia</th>
          <th>Kraj</th>
        </tr>
        <tr>
          <td>Wimbledon</td>
          <td>28.06.2025</td>
          <td>11.07.2025</td>
          <td>Wielka Brytania</td>
        </tr>
    </table>
    <button className="form-button">Szczegóły</button>
    <table>
      <tr>
        <th>Nazwa</th>
        <th>Data rozpoczęcia</th>
        <th>Data zakończenia</th>
        <th>Kraj</th>
      </tr>
      <tr>
        <td>US Open</td>
        <td>25.08.2025</td>
        <td>07.09.2025</td>
        <td>Stany Zjednoczone</td>
      </tr>
    </table>
    <button className="form-button">Szczegóły</button>
    </div>
  );
}

export default Tournaments;