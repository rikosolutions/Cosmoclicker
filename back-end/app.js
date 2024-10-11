const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const dot_env = require("dotenv");
const rateLimit = require("express-rate-limit");

dot_env.config();
const apiRouter = require("./Routes/api/Main");
const app = express();

app.set('trust proxy', 1)
// Rate limiter for production environment
if (process.env.MODE === "prod") {
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAXCALL), 
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use(limiter);
}

if(process.env.MODE === "mainenance"){
    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "ejs");
}

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.disable('etag'); // Disable ETag headers

if(process.env.MODE === "mainenance"){
    app.get('*', function(req, res) {
        res.render('maintenance');
    });
}

// API routes
app.use("/api", apiRouter);

// Serve frontend in production
// if (process.env.MODE === "prod") {

//   const BUILD_PATH = path.join(__dirname, "../front-end/dist");
//   app.use(express.static(BUILD_PATH));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(BUILD_PATH, "index.html"));
//   });

// }

// 404 handler
app.use(function(req, res, next) {
    return res.status(404).json({status: "error",message: "Not found"});
});

// 500 handler
app.use((err, req, res, next) => {
  console.error("500 Handler :",err);
  res.status(err.status || 500).json({ status: "error", message: err.message || "Internal server error" });
});

module.exports = app;
