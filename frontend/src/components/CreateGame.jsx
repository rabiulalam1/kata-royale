import React, { useState } from "react";
import actions from "../api/index";

const CreateGame = (props) => {
  let [name, setName] = useState("");
  let [startDate, setStarDate] = useState("");
  let [endDate, setEndDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res = await actions.newGame({});
    console.log(res.data);
    props.history.push(`/game/${res.data.game._id}`);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Game Name"
          onChange={(e) => setName(e.target.value)}
        ></input>
        <input
          type="text"
          placeholder="Enter Start Date"
          onChange={(e) => setStarDate(e.target.value)}
        ></input>
        <input
          type="text"
          placeholder="Enter End Date"
          onChange={(e) => setEndDate(e.target.value)}
        ></input>
        <button>Submit</button>
      </form>
    </div>
  );
};

export default CreateGame;
