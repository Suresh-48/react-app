import dotenv from "dotenv";
dotenv.config({ silent: true });

const { PORT, REACT_APP_URL, NODE_ENV, REACT_APP_API_URL, REACT_APP_DEFAULT_API_KEY, REACT_API_HEADER, AUTH_TOKEN } =
  process.env;

export const port = PORT;

export const APP_URL = REACT_APP_URL;

export const ENV = NODE_ENV;

export const DEFAULT_API_KEY = REACT_APP_DEFAULT_API_KEY;

export const API_URL = "http://52.66.209.188:3000/";

export const HEADER = REACT_API_HEADER;

export const TOKEN = AUTH_TOKEN;
