import React, { useState } from "react";
import actions from "../api/index";
import CreateGame from "./CreateGame";

function Admin(props) {
  let [url, setUrl] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res = await actions.newKata({ url });
    console.log(res);
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Url"
            onChange={(e) => setUrl(e.target.value)}
          ></input>
          <button>Submit</button>
        </form>
      </div>
      <div className="game">
        <CreateGame {...props} />
      </div>
    </div>
  );
}

export default Admin;
