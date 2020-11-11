import React, { useEffect, useState } from "react";

const Kata = () => {
  const [kata, setKata] = useState([]);

  useEffect(() => {
    async function getKatas() {
      let res = await actions.getKatas;
    }
  });
  return <div></div>;
};

export default Kata;
