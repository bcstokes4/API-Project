import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './ProfileButton.css'
import { useHistory } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const history = useHistory()

  const redirectToGroups = (e) => {
    e.preventDefault()
    setShowMenu(false);
    history.push('/groups')
  }

  return (
    <>
      {user ? (
        <>
          <button onClick={openMenu} className="login-button">
            <i className="fas fa-user-circle" />
          </button>
          <ul className={ulClassName} ref={ulRef}>
            <li className="li-first">Hello, {user.firstName}</li>
            <li>{user.email}</li>
            {/* <li className = 'profile_buttons'onClick={redirectToGroups}>View Groups</li> */}

            <button className="logout-button" onClick={logout}>
                Log Out
            </button>

          </ul>
        </>
      ) : (
        <div className="logged-out-container">
          <div className="log-in-div">
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
          </div>
          <div className="sign-up-div">
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileButton;
