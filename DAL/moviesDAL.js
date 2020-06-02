const axios = require("axios");

exports.getAll = () => {
  return axios.get("http://localhost:8000/api/movies");
};

exports.getById = (id) => {
  return axios.get(`http://localhost:8000/api/movies/${id}`);
};

exports.delete = (id) => {
  return axios.delete(`http://localhost:8000/api/movies/${id}`);
};

exports.post = (obj) => {
  return axios.post("http://localhost:8000/api/movies", obj);
};

exports.put = (obj, id) => {
  return axios.put(`http://localhost:8000/api/movies/${id}`, obj);
};
