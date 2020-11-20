import React, { Component, useState, useEffect } from "react";
import TheContext from "../../TheContext";

const Profile = (props) => {
  return (
    <div>
      Profile Page
      <Welcome /> {/*'Look ma!  No props!!!'*/}
    </div>
  );
};

const Welcome = () => {
  //With Context I can skip the prop drilling and access the context directly
  const { user, setUser, history } = React.useContext(TheContext);

  useEffect(() => {});

  return (
    <div>
      <div>
        Welcome {user?.email} <img src={user?.imageUrl} />
        <button onClick={() => history.push("/")}>Home</button>
      </div>
      <div></div>
    </div>
  );
};

export default Profile;
