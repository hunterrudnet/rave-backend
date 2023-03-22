import express from "express";
import cors from "cors";
import User from "./db/models/user.js";
import UserFollow from "./db/models/userFollow.js";
import Album from "./db/models/album.js";
import Track from "./db/models/track.js";
import Review from "./db/models/review.js";
import spotify from "./spotify/index.js";
import sequelize from "./db/models/index.js";
import userRouter from "./db/controllers/user-controller.js";
import albumRouter from "./db/controllers/album-controller.js";
import trackRouter from "./db/controllers/track-controller.js";
import reviewRouter from "./db/controllers/review-controller.js";
import userFollowRouter from "./db/controllers/userFollow-controller.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 8080;

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(express.json());

try {
    // Use { force: true } to force db to reset and pick up changes on server restart, remove to surpress
    // this behavior.
    await sequelize.sync({ force: true });
} catch (error) {
    console.error('Error synchronizing database:', error);
}

// Base route for user actions.
app.use('/users', userRouter);
app.use('/albums', albumRouter);
app.use('/tracks', trackRouter);
app.use('/reviews', reviewRouter);
app.use('/userFollows', userFollowRouter);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});