import React, { useState } from 'react';

function Register() {
const [userType, setUserType] = useState('player');

const handleUserTypeChange = (event) => {
  setUserType(event.target.value);
};

  return (
    <div className="div-align">
      <h2>Zarejestruj się</h2>
      <form>
        {/* TODO: Walidacja */}
        <label>Login</label>
        <input type="text" placeholder="Login" />
        <label>Hasło</label>
        <input type="password" placeholder="Hasło" />
        <label>Powtórz hasło</label>
        <input type="password" placeholder="Powtórz hasło" />
        <label>E-mail</label>
        <input type="text" placeholder="E-mail" />
        <label>Typ użytkownika</label>
        <select name="role" onChange={handleUserTypeChange}>
          <option value="player">Gracz tenisa</option>
          <option value="manager">Menadżer turniejów</option>
        </select>
        {userType === 'player' && (
          <>
            <label>Imię</label>
            <input type="text" placeholder="Imię" />
            <label>Nazwisko</label>
            <input type="text" placeholder="Nazwisko" />
            <label>Data urodzenia</label>
            <input type="date" placeholder="Data urodzenia" />
          </>
        )}
        <button type="submit">Zarejestruj</button>
      </form>
    </div>
  );
}

export default Register;