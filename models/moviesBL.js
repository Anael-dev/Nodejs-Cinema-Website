const moviesDAL = require("../DAL/moviesDAL");
const moment = require("moment");

exports.getAllMovies = async () => {
  const response = await moviesDAL.getAll();
  const movies = response.data.map((x) => {
    return { ...x, id: x._id };
  });
  return movies;
};

exports.getOneMovie = async (id) => {
  const response = await moviesDAL.getById(id);
  const movie = response.data;
  return { ...movie, id: movie._id };
};

exports.deleteMovie = async (id) => {
  const response = await moviesDAL.delete(id);
  console.log(response);
};

exports.findMovie = async (reqBody) => {
  if (reqBody) {
    console.log(reqBody);
    const input = reqBody.trim().toLowerCase();
    const response = await moviesDAL.getAll();
    const movies = response.data;
    const filtered = movies.filter((x) => x.name.toLowerCase().includes(input));
    return filtered;
  }
};

exports.addMovie = async (reqBody) => {
  const newJson = {
    name: reqBody.name,
    genres: reqBody.genres.split(","),
    image: reqBody.image,
    premiered: reqBody.premiered,
  };
  console.log(newJson);

  const response = await moviesDAL.post(newJson);
  const movie = response.data;
  console.log(movie);
};

exports.editMovie = async (reqBody, id) => {
  const updatedJson = {
    name: reqBody.name,
    genres: reqBody.genres.split(","),
    image: reqBody.image,
    premiered: reqBody.premiered,
  };
  console.log(updatedJson);

  const response = await moviesDAL.put(updatedJson, id);
  const movie = response.data;
  console.log(movie);
};
