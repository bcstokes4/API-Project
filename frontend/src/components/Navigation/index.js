import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='header-div'>
    <ul className='header-ul'>
      <li>
        <NavLink exact to="/" className="Mingle-logo">Mingle</NavLink>
      </li>
      {isLoaded && (<div className='create-group-login-div'>
        {sessionUser && (<NavLink to='/groups/new'>Start a new group</NavLink>)}
        <li>
          <ProfileButton user={sessionUser} />
        </li>
        </div>
      )}
    </ul>
    </div>
  );
}

export default Navigation;
