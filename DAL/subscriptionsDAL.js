const axios = require("axios");

exports.getAll = () => {
  return axios.get("http://localhost:8000/api/subscriptions");
};

exports.getById = (id) => {
  return axios.get(`http://localhost:8000/api/subscriptions/${id}`);
};

exports.delete = (id) => {
  return axios.delete(`http://localhost:8000/api/subscriptions/${id}`);
};

exports.post = (obj) => {
  return axios.post("http://localhost:8000/api/subscriptions", obj);
};

exports.put = (obj, id) => {
  return axios.put(`http://localhost:8000/api/subscriptions/${id}`, obj);
};
