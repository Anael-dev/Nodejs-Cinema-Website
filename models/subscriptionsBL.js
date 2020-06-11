const subscriptionsDAL = require("../DAL/subscriptionsDAL");

exports.getSubscriptions = async () => {
  const subscriptionsResponse = await subscriptionsDAL.getAll();
  return subscriptionsResponse.data.map((x) => {
    return { ...x, id: x._id };
  });
};

exports.deleteSubscription = async (id) => {
  const response = await subscriptionsDAL.delete(id);
  const subscription = response.data;
  console.log(subscription);
};

exports.subscribeToMovie = async (reqBody, id) => {
  const subscriptions = await this.getSubscriptions();

  const filtered = subscriptions.filter((x) => x.memberId == id);
  if (filtered.length > 0) {
    const member = filtered[0];
    const memberId = member.id;

    const newMovie = {
      movieId: reqBody.movie,
      date: reqBody.date,
    };
    const putResponse = await subscriptionsDAL.put(newMovie, memberId);
    const putResult = putResponse.data;
    console.log(putResult);
  } else {
    const newJson = {
      memberId: id,
      movies: [
        {
          movieId: reqBody.movie,
          date: reqBody.date,
        },
      ],
    };
    const postResponse = await subscriptionsDAL.post(newJson);
    const postResult = postResponse.data;
    console.log(postResult);
  }
};
