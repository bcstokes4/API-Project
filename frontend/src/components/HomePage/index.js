import React from 'react';
import './HomePage.css';
import { Link, useHistory } from "react-router-dom";
import mingleImg from './meetup-landingpage-image.jpeg'
import img1 from './landingpage-link-img-1.webp'
import img2 from './landingpage-link-img-2.webp'
import img3 from './landingpage-link-img-3.webp'
import { useDispatch, useSelector } from 'react-redux'
import SignupFormModal from "../SignupFormModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { useState } from 'react';


function HomePage() {
    const history = useHistory()
    const redirect = (path) => {
        history.push(path)
    }

    const sessionUser = useSelector((state) => state.session.user)
    const joinGroupDisable = sessionUser ? '' : 'disable-join-group-link'

    const [hover, setHover] = useState(false)
    const [hover2, setHover2] = useState(false)
    const [hover3, setHover3] = useState(false)

    const setHoverEffectsOn = () => {
        setHover(true)
    }
    const setHoverEffectsOff = () => {
        setHover(false)
    }
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
                <div className={`s3-container-1 ${hover ? 'homepage-link-hover-effects' : ''}`}
                onClick={() => redirect('/groups')}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                >
                    <img src={img1} className='section-3-images'/>
                    <Link to='/groups' className='s3-links'>See all groups</Link>
                    <p>
                        Explore a vibrant community of like-minded individuals on Mingle.
                        Browse and discover a wide array of groups, each with its own unique interests and activities.
                    </p>
                </div>
                <div className={`s3-container-2 ${hover2 ? 'homepage-link-hover-effects' : ''}`}
                onClick={() => redirect('/events')}
                onMouseEnter={() => setHover2(true)}
                onMouseLeave={() => setHover2(false)}
                >
                    <img src={img2} className='section-3-images'/>
                    <Link className='s3-links' to='/events'>Find an event</Link>
                    <p>
                        Dive into a world of exciting events and activities hosted by Mingle's dynamic community.
                        Whether it's a cultural gathering, a sports match, or an educational workshop, you can easily find the perfect event to attend.
                    </p>
                </div>
                <div className={`s3-container-3 ${sessionUser && hover3 ? 'homepage-link-hover-effects' : 'disable-pointer'}`}
                onClick={() => sessionUser && redirect('/groups/new')}
                onMouseEnter={() => setHover3(true)}
                onMouseLeave={() => setHover3(false)}
                >
                    <img src={img3} className='section-3-images'/>
                    <Link to='/groups/new' className={`s3-links ${joinGroupDisable}`}>Start a new group</Link>
                    <p>
                        {sessionUser ? `From hobby enthusiasts to change-makers, this is your platform to foster connections, spark conversations, and make your mark on the world.
                        Take the first step towards building your unique community today!` : `Log in or sign up to start using Mingle today!`}
                    </p>
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
