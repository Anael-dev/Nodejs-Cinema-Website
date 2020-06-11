const moviesDAL = require("../DAL/moviesDAL");
const membersBL = require("./membersBL");
const subscriptionsBL = require("./subscriptionsBL");
const moment = require("moment");

exports.getAllMovies = async () => {
  const response = await moviesDAL.getAll();
  const movies = response.data.map((x) => {
    return { ...x, id: x._id };
  });
  return movies;
};

exports.getMembers = async (filtered, searchedMovie) => {
  return Promise.all(
    filtered.map(async (x) => {
      const member = await membersBL.getOneMember(x.memberId);
      const movieJson = x.movies.find(
        (movie) => movie.movieId === searchedMovie.id
      );
      return { id: x.memberId, name: member.name, date: movieJson.date };
    })
  );
};

exports.getAllMappedMovies = async () => {
  const movies = await this.getAllMovies();
  const subscriptions = await subscriptionsBL.getSubscriptions();

  const moviesSubscriptions = await Promise.all(
    movies.map(async (movie) => {
      const filtered = subscriptions.filter((x) =>
        x.movies.some((x) => x.movieId == movie.id)
      );
      if (filtered.length > 0) {
        const members = await this.getMembers(filtered, movie);
        return {
          ...movie,
          watchedMembers: members,
        };
      } else {
        return movie;
      }
    })
  );
  return moviesSubscriptions;
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
    const input = reqBody.trim().toLowerCase();
    const response = await moviesDAL.getAll();
    const movies = response.data;
    const filtered = movies.filter((x) => x.name.toLowerCase().includes(input));
    return filtered[0];
  }
};

exports.addMovie = async (reqBody) => {
  const newJson = {
    name: reqBody.name,
    genres: reqBody.genres.split(","),
    image: reqBody.image,
    premiered: reqBody.premiered,
  };

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

  const response = await moviesDAL.put(updatedJson, id);
  const movie = response.data;
  console.log(movie);
};
