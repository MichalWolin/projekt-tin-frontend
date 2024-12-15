function Register() {
  return (
    <div className="div-align">
      <h2>Zarejestruj się</h2>
      <form>
        <label>Login</label>
        <input type="text" placeholder="Login" />
        <label>Hasło</label>
        <input type="password" placeholder="Hasło" />
        <label>Powtórz hasło</label>
        <input type="password" placeholder="Powtórz hasło" />
        <button type="submit">Zarejestruj</button>
      </form>
    </div>
  );
}

export default Register;