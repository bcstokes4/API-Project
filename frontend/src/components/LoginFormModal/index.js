import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from 'react-router-dom'
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const history = useHistory()

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };
  const demoLogin = (e) => {
    e.preventDefault();
    // return
    dispatch(sessionActions.login({
      credential: 'Demo-lition',
      password: 'password'
    }))
    .then(closeModal)
    history.push('/')
  };
  return (
    <div className="login-form-main-container">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className="login-form-container">
        <label>

          <input
            className="login-input-username"
            type="text"
            value={credential}
            placeholder="Username or Email"
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>

          <input
            className="login-input-password"
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p className="login-form-errors">{errors.credential}</p>
        )}
        <button type="submit" className="login-input-submit-button" disabled={credential.length < 4 || password.length < 6}>Log In</button>
      </form>
      <button className="demo-user-button" onClick={demoLogin}>Demo User</button>
    </div>
  );
}

export default LoginFormModal;
