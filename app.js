var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var loginRouter = require("./routes/login");
var mainRouter = require("./routes/main");
var moviesRouter = require("./routes/movies");
var subscriptionsRouter = require("./routes/subscriptions");
var usersRouter = require("./routes/users");

const usersDB = require("./configs/database");

const bodyParser = require("body-parser");
var session = require("express-session");
var flash = require("connect-flash");

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true, //
  })
);

app.use(express.static("public"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/main", mainRouter);
app.use("/movies", moviesRouter);
app.use("/subscriptions", subscriptionsRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
