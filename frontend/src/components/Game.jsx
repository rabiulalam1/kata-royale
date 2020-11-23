import React, { useEffect, useState } from "react";
import moment from "moment";
import actions from "../api/index";

const Game = (props) => {
  const [gameDetail, setGameDetail] = useState({});

  useEffect(() => {
    console.log("Hello World");
    async function getGameDetail() {
      console.log("Gameeeeeeeeee");
      let res = await actions.getGameDetail(props.match.params.id);
      console.log(res?.data);
      setGameDetail(res?.data.game);
    }
    getGameDetail();
  }, []);

  return (
    <div>
      <h1>Game Page</h1>
      <p> Game Name: {gameDetail.name} </p>
      <p>Start Date:{moment(gameDetail.startDate).fromNow()} </p>
      <p>End Date:{moment(gameDetail.endDate).fromNow()} </p>
    </div>
  );
};

export default Game;
