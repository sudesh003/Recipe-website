import './login_style.css';

function Login() {
  return (
    <div className='mainbody'>
    <div className="main">
      {/* <input type="checkbox" id="chk" aria-hidden="true" />
       */}
      <div className="login">
        <form action="http://localhost:5000/login" method="POST">
          <label className='labelclass' htmlFor="chk" aria-hidden="true">Login</label>
          <input className='inputclass' type="email" name="email" placeholder="Email" required="" />
          <input className='inputclass' type="password" name="pswd" placeholder="Password" required="" />
          <button className='buttonclass' type="submit">Login</button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Login;
