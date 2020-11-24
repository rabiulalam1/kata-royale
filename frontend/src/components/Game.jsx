import React, { useEffect, useState } from "react";
import moment from "moment";
import actions from "../api/index";
import TheContext from "../TheContext";

const Game = (props) => {
  const [gameDetail, setGameDetail] = useState({});
  const [users, setUsers] = useState([]);
  const { user, setUser, history } = React.useContext(TheContext);
  const [gameState, setGameState] = useState({ players: [] });

  useEffect(() => {
    async function getGameDetail() {
      let res = await actions.getGameDetail(props.match.params.id);
      console.log(res.data);
      setGameDetail(res.data.game);
    }
    getGameDetail();
    actions.socket.on("Join", (data) => {
      setGameState(data);
      console.log(data.players);
    });
    // window.onbeforeunload = () => {
    //   actions.socket.emit("leave", { user, gameId: props.match.params.id });
    // };
    return () => {
      actions.socket.emit("leave", { user, gameId: props.match.params.id });
    };
  }, []);
  console.log(gameState);

  const DisplayUser = () => {
    return gameState.players.map((eachPlayer) => {
      return <li>{eachPlayer.name}</li>;
    });
  };
  return (
    <div>
      <h1>Game Page</h1>
      <p> Game Name: {gameDetail.name} </p>
      <p>Start Date:{moment(gameDetail.startDate).fromNow()} </p>
      <p>End Date:{moment(gameDetail.endDate).fromNow()} </p>
      <p>
        <ul>
          <DisplayUser />
        </ul>
      </p>
    </div>
  );
};

export default Game;
