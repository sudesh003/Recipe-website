import './signup_style.css';
import React from 'react';
import { Link } from 'react-router-dom';


function Signup() {
    return (
        <div className='mainbody'>
            <div className="main">
                <div className="signup">
                    <form action="http://localhost:5000/signup" method="POST">
                        <label className='labelclass' htmlFor="chk" aria-hidden="true">Sign up</label>
                        <input className='inputclass' type="text" name="txt" placeholder="User name" required="" />
                        <input className='inputclass' type="email" name="email" placeholder="Email" required="" />
                        <input className='inputclass' type="password" name="pswd" placeholder="Password" required="" />
                        <button className='buttonclass'>Sign up</button>
                    </form>
                    <div className='form-bottom'>
                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Signup;
