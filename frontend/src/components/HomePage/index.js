import React from 'react';
import './HomePage.css';
import { Link } from "react-router-dom";
import mingleImg from './meetup-landingpage-image.jpeg'
import img1 from './landingpage-link-img-1.webp'
import img2 from './landingpage-link-img-2.webp'
import img3 from './landingpage-link-img-3.webp'
import { useDispatch, useSelector } from 'react-redux'
import SignupFormModal from "../SignupFormModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";

function HomePage() {

    const sessionUser = useSelector((state) => state.session.user)
    const joinGroupDisable = sessionUser ? '' : 'disable-join-group-link'
    return (
        <div className='homepage-container'>
            <div className='section-1'>
                <div className='section-1-text-container'>
                    <h1 className='section-1-h1'> The people platform-Where interests become friendships</h1>
                    <p>Your new community is waiting for you. For 20+ years, millions of people have chosen Mingle to make real connections over shared interests. Start a group today with a 30-day free trial.</p>
                </div>
                <img src={mingleImg} className='section-1-img' />
            </div>
            <div className='section-2'>
                <h3 className='section-2-heading'>How Mingle Works</h3>
                <p>Mingle makes it easy to build a community. There are more than 60 million people on Mingle looking to gather over over shared interests and hobbies, build professional networks, or just have some fun.</p>
            </div>
            <div className='section-3'>
                <div className='s3-container-1'>
                    <img src={img1} className='section-3-images'/>
                    <Link to='/groups' className='s3-links'>See all groups</Link>
                    <p>placeholder text blablabla</p>
                </div>
                <div className='s3-container-2'>
                    <img src={img2} className='section-3-images'/>
                    <Link className='s3-links' to='/events'>Find an event</Link>
                    <p>placeholder text blablabla</p>
                </div>
                <div className='s3-container-3'>
                    <img src={img3} className='section-3-images'/>
                    <Link to='/groups/new' className={`s3-links ${joinGroupDisable}`}>Start a new group</Link>
                    <p>placeholder text blablabla</p>
                </div>
            </div>
            <div className='section-4'>
            {!sessionUser && (
          <button>
            <OpenModalMenuItem
          itemText='Join Mingle'
          modalComponent={<SignupFormModal />}
          /></button>
      )}
            </div>

        </div>
    )
}

export default HomePage;
