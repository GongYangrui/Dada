// config.js
const isDev = true;

const baseURL = isDev
  ? "http://localhost:8000"
  : "https://45ad-72-33-2-182.ngrok-free.app";

module.exports = {
  baseURL
};
