const User = require("./usersModel");
const usersJson = require("../DAL/Users.json");
const usersDAL = require("../DAL/usersDAL.js");
const permissionsJson = require("../DAL/Permissions.json");
const permissionsDAL = require("../DAL/permissionsDAL.js");

const moment = require("moment");

exports.checkLogin = (reqBody) => {
  return new Promise((resolve, reject) => {
    User.find(
      { UserName: reqBody.username, Password: reqBody.password },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          if (data.length > 0) {
            const user = data[0];
            resolve({ id: user._id, userName: user.UserName });
          } else {
            resolve({
              message: "You have entered an invalid username or password",
            });
          }
        }
      }
    );
  });
};

exports.findUserInJson = async (id) => {
  const userId = id.toString();

  const users = await usersDAL.readFile();
  const filteredUser = users.filter((x) => x.id === userId);
  const userData = filteredUser[0];

  const permissions = await permissionsDAL.readFile();
  const filteredPerm = permissions.filter((x) => x.id === userId);
  const userPermissions = filteredPerm[0].permissions;

  return { user: userData, permissions: userPermissions };
};

exports.getUsersFromDB = () => {
  return new Promise((resolve, reject) => {
    User.find({}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

exports.findAndUpdateAccountDB = (reqBody) => {
  return new Promise((resolve, reject) => {
    if (reqBody.username && reqBody.password) {
      const username = reqBody.username;
      const password = reqBody.password;
      User.find({ UserName: username }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          if (data.length > 0) {
            const user = data[0];
            User.findByIdAndUpdate(user._id, { Password: password }, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve({ success: "updated" });
              }
            });
          } else {
            resolve({
              failed:
                "We didn't recognize this username or valid password, please try again",
            });
          }
        }
      });
    } else {
      resolve({ failed: "Please enter vaild username and password" });
    }
  });
};

exports.getAllMappedUsers = async () => {
  let usersMappedArr = [];
  const usersDb = await this.getUsersFromDB();
  const usersJson = await usersDAL.readFile();
  const usersPermissions = await permissionsDAL.readFile();
  if (
    usersDb.length === 1 ||
    usersJson.length === 1 ||
    usersPermissions.length === 1
  ) {
    return usersMappedArr;
  }
  usersMappedArr = usersJson.slice(1).map((user) => {
    return {
      id: user.id,
      name: user.firstName + " " + user.lastName,
      username: usersDb.find((x) => x._id == user.id).UserName,
      createdDate: user.createdDate,
      sessionTime: user.sessionTime,
      permissions: usersPermissions.find((x) => x.id === user.id).permissions,
    };
  });
  return usersMappedArr;
};

exports.findUser = async (id) => {
  const users = await this.getAllMappedUsers();
  let user = users.find((x) => x.id === id);
  const fullName = user.name.split(" ");
  user = { ...user, fname: fullName[0], lname: fullName[1] };
  return user;
};

exports.getAllPermissions = async () => {
  let usersPerm = await permissionsDAL.readFile();

  const adminPermissions = usersPerm[0].permissions;
  return adminPermissions;
};

/** DELETE **/
exports.deleteUserDB = (id) => {
  return new Promise((resolve, reject) => {
    User.findByIdAndDelete(id, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve("user deleted");
      }
    });
  });
};

exports.deleteUserJson = async (id) => {
  const usersJson = await usersDAL.readFile();
  const user = usersJson.find((x) => x.id === id);
  const index = usersJson.indexOf(user);
  usersJson.splice(index, 1);

  const response = await usersDAL.writeFile(usersJson);
  return response;
};

exports.deleteUserPermissions = async (id) => {
  const usersPermissions = await permissionsDAL.readFile();
  const user = usersPermissions.find((x) => x.id === id);
  const index = usersPermissions.indexOf(user);
  usersPermissions.splice(index, 1);

  const response = await permissionsDAL.writeFile(usersPermissions);
  return response;
};

exports.deleteUser = async (id) => {
  //DB
  const responseDB = await this.deleteUserDB(id);
  //UsersJson
  const responseJson = await this.deleteUserJson(id);
  //PermissionsJson
  const responsePerm = await this.deleteUserPermissions(id);

  return [responseDB, responseJson, responsePerm];
};

/** UPDATE **/
exports.updateUserDB = (id, reqBody) => {
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(id, { UserName: reqBody.username }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("Updated!");
      }
    });
  });
};

exports.updateUserData = async (id, reqBody) => {
  const userId = id.toString();

  let users = await usersDAL.readFile();
  const filteredUser = users.find((x) => x.id === userId);
  const index = users.indexOf(filteredUser);
  const updatedUser = {
    ...filteredUser,
    firstName: reqBody.fname,
    lastName: reqBody.lname,
    sessionTime: Number(reqBody.sessiontime),
  };
  users.splice(index, 1, updatedUser);

  let writeResponse = await usersDAL.writeFile(users);
  return writeResponse;
};

exports.updateUserPermissions = async (id, reqBody) => {
  const userId = id.toString();

  let usersPerm = await permissionsDAL.readFile();
  let filteredUser = usersPerm.find((x) => x.id === userId);
  const index = usersPerm.indexOf(filteredUser);
  const updatedPerm = {
    ...filteredUser,
    permissions: reqBody.permission,
  };
  usersPerm.splice(index, 1, updatedPerm);

  let writeResponse = await permissionsDAL.writeFile(usersPerm);
  return writeResponse;
};

exports.updateUser = async (id, reqBody) => {
  //DB
  const responseDB = await this.updateUserDB(id, reqBody);
  //UsersJson
  const responseJson = await this.updateUserData(id, reqBody);
  //permissionsJson
  const responsePerm = await this.updateUserPermissions(id, reqBody);
  return [responseDB, responseJson, responsePerm];
};

/** ADD **/
exports.addUserDB = (reqBody) => {
  let newUser = new User({
    UserName: reqBody.username,
    Password: "",
  });

  return new Promise((resolve, reject) => {
    newUser.save((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result._id);
      }
    });
  });
};
exports.addUserData = async (id, reqBody) => {
  const userId = id.toString();

  let users = await usersDAL.readFile();

  const today = moment(new Date()).format("DD/MM/YYYY");

  const newUser = {
    id: userId,
    firstName: reqBody.fname,
    lastName: reqBody.lname,
    createdDate: today,
    sessionTime: Number(reqBody.sessiontime),
  };

  users.push(newUser);

  let writeResponse = await usersDAL.writeFile(users);
  return writeResponse;
};

exports.addUserPermissions = async (id, reqBody) => {
  const userId = id.toString();

  let usersPerm = await permissionsDAL.readFile();

  const newPerm = {
    id: userId,
    permissions: reqBody.permission,
  };
  usersPerm.push(newPerm);

  let writeResponse = await permissionsDAL.writeFile(usersPerm);
  return writeResponse;
};

exports.addUser = async (reqBody) => {
  //DB
  const userId = await this.addUserDB(reqBody);
  //UsersJson
  const responseJson = await this.addUserData(userId, reqBody);
  //permissionsJson
  const responsePerm = await this.addUserPermissions(userId, reqBody);
  return [responseJson, responsePerm];
};
