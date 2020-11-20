import React, { Component, useState, useEffect } from "react";
import actions from "../../api/index";

const Home = (props) => {
  let [kata, setKata] = useState([]);
  useEffect(() => {
    async function getKata() {
      let res = await actions.getDailyKata();
      setKata(res.data);
    }
    getKata();
  }, []);

  const changeFruit = async () => {
    let res = await actions.fromCodeWars({
      action: "honor_changed",
      user: { id: "5d8974a1abb00c002a057f22", honor: 198, honor_delta: 2 },
    });
    console.log(res.data);
  };

  return (
    <div>
      <button onClick={changeFruit}>Submit Kata</button>
      <h1>Today's Kata Challenge</h1>
      <div>
        <h3>Kata Name: {kata.kata?.[0].name}</h3>
        <h5>Level: {kata.kata?.[0].rank.name}</h5>
        <h5>
          Url:{" "}
          <a href={kata.kata?.[0].url} target="_blank">
            Go to the Kata
          </a>
        </h5>
      </div>
      <div>
        <h5>*Codewars Setting Instruction:</h5>
        <p>codewars.com &#8594; Account Settings &#8594; Webhooks &#8601;</p>
        <p>Paste this URL into Payload url field &#8595;</p>
        <p>
          <em>
            https://kata-royale.herokuapp.com/api/kata/{props.user?.email}
          </em>
        </p>
      </div>
    </div>
  );
};

export default Home;
