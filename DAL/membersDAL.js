const axios = require("axios");

exports.getAll = () => {
  return axios.get("http://localhost:8000/api/members");
};

exports.getById = (id) => {
  return axios.get(`http://localhost:8000/api/members/${id}`);
};

exports.delete = (id) => {
  return axios.delete(`http://localhost:8000/api/members/${id}`);
};

exports.post = (obj) => {
  return axios.post("http://localhost:8000/api/members", obj);
};

exports.put = (obj, id) => {
  return axios.put(`http://localhost:8000/api/members/${id}`, obj);
};
