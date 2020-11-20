import React, { useState, useEffect } from "react";
import TheContext from "../../TheContext";
import actions from "../../api/index";

const Profile = (props) => {
  let [userKata, setUserKata] = useState([]);

  useEffect(() => {
    async function getUserKata() {
      let res = await actions.getUserKata();
      console.log(res?.data);
      setUserKata(res?.data.allKatas);
    }
    getUserKata();
  }, []);

  return (
    <div>
      Profile Page
      <Welcome /> {/*'Look ma!  No props!!!'*/}
      <div>
        <h3>You have completed {userKata.length} katas!!</h3>
      </div>
    </div>
  );
};

const Welcome = () => {
  //With Context I can skip the prop drilling and access the context directly
  const { user, setUser, history } = React.useContext(TheContext);

  return (
    <div>
      Welcome {user?.email} <img src={user?.imageUrl} />
      <button onClick={() => history.push("/")}>Home</button>
    </div>
  );
};

export default Profile;
