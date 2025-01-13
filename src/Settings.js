import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

function Settings() {
  const [cookies] = useCookies(['user']);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies.user || (cookies.user.role !== "manager" && cookies.user.role !== "player")) {
      navigate("/");
    }
  }, [cookies.user]);

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