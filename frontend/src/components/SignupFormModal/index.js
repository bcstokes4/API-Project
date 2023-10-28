import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();


  // email validation func
  // function isValidEmail(email) {
  //   const [a, b] = email.split('@');
  //   if ((email.indexOf('@') === -1) || (b.indexOf('.') === -1)) {
  //     return false;
  //   }
  //   if (a.length === 0 || b.length === 0) {
  //     return false;
  //   }
  //   if (a.startsWith('.') || a.endsWith('.')) {
  //     return false;
  //   }
  //   return true;
  // }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className="signup-form-main-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className="signup-form-container">
        <label>

          <input
            type="text"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className="signup-errors">{errors.email}</p>}
        {/* {isValidEmail(email) ? '' : <p className="signup-errors">The provided email is invalid</p>} */}
        <label>

          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className="signup-errors">{errors.username}</p>}
        <label>

          <input
            type="text"
            value={firstName}
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p className="signup-errors">{errors.firstName}</p>}
        <label>

          <input
            type="text"
            value={lastName}
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p className="signup-errors">{errors.lastName}</p>}
        <label>

          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="signup-errors">{errors.password}</p>}
        <label>

          <input
            type="password"
            value={confirmPassword}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && (
          <p className="signup-errors">{errors.confirmPassword}</p>
        )}
        <button type="submit"
        className={`signup-button ${firstName.length  < 2 || lastName.length < 2 || username.length < 4 || password.length < 6 || password !== confirmPassword ? 'disabled' : ''}`}
        disabled={firstName.length  < 2 || lastName.length < 2 || username.length < 4 || password.length < 6 || password !== confirmPassword}
        >Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
