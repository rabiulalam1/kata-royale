import React, { Component, Fragment, useState, useEffect } from "react";
import { Switch, Route, NavLink, useHistory } from "react-router-dom";
import TheContext from "./TheContext";
import Home from "./components/home/Home";
import NotFound from "./components/404/NotFound.js";
import SignUp from "./components/auth/SignUp";
import LogIn from "./components/auth/LogIn";
import Profile from "./components/profile/Profile";
import actions from "./api/index";
import GoogleAuth from "./components/auth/GoogleAuth";
import GoogleAuthLogin from "./components/auth/GoogleAuthLogin";
import Admin from "./components/Admin";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const App = () => {
  let [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      let user = await actions.getUser();
      console.log("user is", user);
      setUser(user?.data);
    }
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", (data) => {
      console.log(data);
    });
    getUser();
  }, []);

  const logOut = async () => {
    let res = await actions.logOut();
    setUser(null);
  };

  const history = useHistory();

  return (
    <TheContext.Provider value={{ history, user, setUser }}>
      {user?.email}
      <nav>
        <NavLink to="/home">Home</NavLink>

        {user ? (
          <Fragment>
            <NavLink onClick={logOut} to="/">
              Log Out
            </NavLink>
            <NavLink to="/profile">Profile</NavLink>
          </Fragment>
        ) : (
          <Fragment>
            <NavLink to="/sign-up">Sign Up</NavLink>
            <NavLink to="/log-in">Log In</NavLink>
            {!user && <GoogleAuth setUser={setUser} />}
            {!user && <GoogleAuthLogin setUser={setUser} />}
          </Fragment>
        )}
      </nav>
      <Switch>
        <Route
          exact
          path="/home"
          render={(props) => <Home {...props} user={user} />}
        />

        <Route exact path="/admin" render={(props) => <Admin {...props} />} />

        <Route
          exact
          path="/sign-up"
          render={(props) => <SignUp {...props} setUser={setUser} />}
        />
        <Route
          exact
          path="/log-in"
          render={(props) => <LogIn {...props} setUser={setUser} />}
        />
        <Route
          exact
          path="/profile"
          render={(props) => <Profile {...props} />}
        />

        <Route component={NotFound} />
      </Switch>

      <NotificationContainer />
    </TheContext.Provider>
  );
};
export default App;
