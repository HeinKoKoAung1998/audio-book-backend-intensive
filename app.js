const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const rateLimit = require('express-rate-limit');

const userRouter = require("./router/user.router");
const bookRouter = require("./router/book.router");
const audioRouter = require("./router/audio.router");
const favoriteRouter = require("./router/favorite.router");
const historyRouter = require("./router/history.router");
const googleRouter = require('./router/google.router');
const userActivityRouter = require('./router/user.activity.router');

const connection = require("./connection");

const corsOptions = {
  origin: "*"
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

cron.schedule('*/5 * * * *', () => {
  const query = "update UserActivity set status = 'Inactive' where last_active_time <= NOW() - INTERVAL 5 MINUTE";
  connection.query(query, (err, results) => {
    if (err) {
      console.log(err);
    }
  });
});




const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 200, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

app.use(limiter)

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/audios", audioRouter);
app.use("/favorites", favoriteRouter);
app.use("/histories", historyRouter);
app.use("/auth", googleRouter);
app.use('/active', userActivityRouter);

module.exports = app;