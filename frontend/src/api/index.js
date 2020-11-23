import axios from "axios";
import baseURL from "./config.js";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import io from "socket.io-client";

const socket = io(baseURL.replace("/api", ""));

socket.on("hi", (data) => console.log(data));

socket.on("kata-completed", (data) => console.log(data));

socket.on("Join", (data) => console.log(data));

console.log(baseURL);

const token = window.localStorage.getItem("token");
let t = token ? token.substring(0, 15) : null;

console.log("TOKEN", t, "NODE_ENV", process.env.NODE_ENV);

let resetHead = () => {
  return {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };
};

const API = axios.create({
  withCredentials: true,
  baseURL,
  headers: { Authorization: `Bearer ${token}` },
});

const actions = {
  getUser: async () => {
    return await API.get(`/user`, resetHead());
  },
  signUp: async (user) => {
    let res = await API.post("/signup", user, resetHead());
    window.localStorage.setItem("token", res?.data?.token);
    return res;
  },
  logIn: async (user) => {
    let res = await API.post("/login", user, resetHead());
    window.localStorage.setItem("token", res?.data?.token);
    return res;
  },
  logOut: async () => {
    window.localStorage.removeItem("token");
    return await API.get("/logout", resetHead());
  },

  newKata: async (kata) => {
    return await API.post("/newKata", kata, resetHead());
  },

  fromCodeWars: async (code) => {
    return await API.post("/kata/srprsworld@gmail.com", code, resetHead());
  },

  getDailyKata: async () => {
    return await API.get("/getdailykata", resetHead());
  },

  getUserKata: async () => {
    return await API.get("/getuserkata", resetHead());
  },

  newGame: async (data) => {
    return await API.post("/newgame", data, resetHead());
  },

  getGameDetail: async (id) => {
    socket.emit("Join Game", { id, ...resetHead() });
    return await API.get(`/gameDetail?id=${id}`, resetHead());
  },

  getAllGames: async () => {
    return await API.get("/getAllGames", resetHead());
  },
};

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error?.response?.data);
    if (error?.response?.data.name !== "JsonWebTokenError")
      NotificationManager.error(String(error?.response?.data.message));
    else NotificationManager.error("Please signup or login");
  }
);

export default actions;
