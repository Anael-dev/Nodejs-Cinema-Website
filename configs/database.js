const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/users1DB", {
  useNewUrlParser: true,
});

const db = mongoose.connection;

db.once("open", () => console.log("Connecting to users1DB succeeded !!"));
