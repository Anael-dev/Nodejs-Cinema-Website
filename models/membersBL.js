const membersDAL = require("../DAL/membersDAL");
const subscriptionsBL = require("./subscriptionsBL");
const moviesBL = require("./moviesBL");

exports.getMembers = async () => {
  const membersResponse = await membersDAL.getAll();
  return membersResponse.data.map((x) => {
    return { ...x, id: x._id };
  });
};

exports.getMovies = async (filtered) => {
  return Promise.all(
    filtered[0].movies.map(async (x) => {
      const movie = await moviesBL.getOneMovie(x.movieId);
      return { id: x.movieId, name: movie.name, date: x.date };
    })
  );
};

exports.getRestMovies = async (movies) => {
  let allMovies = await moviesBL.getAllMovies();
  movies.forEach((movie) => {
    const foundmovie = allMovies.find((x) => x.id === movie.id);
    const index = allMovies.indexOf(foundmovie);
    allMovies.splice(index, 1);
  });

  return allMovies;
};

exports.getAllMappedMembers = async () => {
  const members = await this.getMembers();
  const subscriptions = await subscriptionsBL.getSubscriptions();

  const membersSubscriptions = await Promise.all(
    members.map(async (member) => {
      const filtered = subscriptions.filter((x) => x.memberId == member.id);
      if (filtered.length > 0) {
        const movies = await this.getMovies(filtered);
        const mappedMovies = await this.getRestMovies(movies);
        return {
          ...member,
          watchedMovies: movies,
          restMovies: mappedMovies,
        };
      } else {
        return {
          ...member,
          restMovies: await moviesBL.getAllMovies(),
        };
      }
    })
  );

  return membersSubscriptions;
};

exports.getOneMember = async (id) => {
  const response = await membersDAL.getById(id);
  const member = response.data;
  return { ...member, id: id };
};

exports.getOneMappedMember = async (id) => {
  const members = await this.getAllMappedMembers();
  const member = members.find((x) => x.id == id);
  return member;
};

exports.editMember = async (reqBody, id) => {
  const updatedJson = {
    name: reqBody.name,
    email: reqBody.email,
    city: reqBody.city,
  };

  const response = await membersDAL.put(updatedJson, id);
  const member = response.data;
};

exports.deleteMember = async (id) => {
  const responseMember = await membersDAL.delete(id);
  const member = responseMember.data;

  const subscriptions = await subscriptionsBL.getSubscriptions();
  const filtered = subscriptions.filter((x) => x.memberId == id);
  if (filtered.length > 0) {
    await subscriptionsBL.deleteSubscription(filtered[0].id);
  }
};

exports.addMember = async (reqBody) => {
  const newJson = {
    name: reqBody.name,
    email: reqBody.email,
    city: reqBody.city,
  };

  const response = await membersDAL.post(newJson);
  const member = response.data;
  console.log(member);
};
