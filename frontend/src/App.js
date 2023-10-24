import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import HomePage from './components/HomePage';
import GroupsListPage from "./components/GroupsListPage";
import GroupDetailsPage from "./components/GroupDetailsPage";
import EventsListPage from "./components/EventsListPage";
import EventDetailsPage from "./components/EventDetailsPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch>
        <Route exact path='/'>
          <HomePage/>
        </Route>
        <Route path='/groups/:groupId'>
          <GroupDetailsPage/>
        </Route>
        <Route path='/events/:eventId'>
          <EventDetailsPage/>
        </Route>
        <Route path='/groups'>
            <GroupsListPage/>
        </Route>
        <Route path='/events'>
            <EventsListPage/>
        </Route>
        </Switch>}
    </>
  );
}

export default App;
