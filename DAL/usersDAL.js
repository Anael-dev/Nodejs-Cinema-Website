const jsonfile = require("jsonfile");

exports.readFile = () => {
  return new Promise((resolve, reject) => {
    jsonfile.readFile(__dirname + "/Users.json", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

exports.writeFile = (dataObj) => {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile(__dirname + "/Users.json", dataObj, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("Users file is written");
      }
    });
  });
};
