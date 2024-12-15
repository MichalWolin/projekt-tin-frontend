function Login() {
  return (
    <div className="div-align">
      <h2>Zaloguj się</h2>
        <form action="login.html">
          <label>Login</label>
          <input type="text" placeholder="Login" />
          <label>Hasło</label>
          <input type="password" placeholder="Hasło" />
          <button type="submit">Zaloguj</button>
        </form>
    </div>
  );
}

export default Login;