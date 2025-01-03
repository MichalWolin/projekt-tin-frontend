import { useNavigate } from 'react-router-dom';

function Settings() {
  const navigate = useNavigate();

  return (
    <div className="div-align">
      <h2>Ustawienia</h2>
      <button className="form-button" onClick={() => navigate("/settings/edit-data")}>Edytuj dane</button>
      <button className="form-button" onClick={() => navigate("/settings/change-password")}>Zmień hasło</button>
      <button className="form-button" onClick={() => navigate("/settings/delete-account")}>Usuń konto</button>
    </div>
  );
};

export default Settings;