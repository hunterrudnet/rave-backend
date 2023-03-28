import express from "express";
import cors from "cors";
import Like from "./db/models/like.js";
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
import likeRouter from "./db/controllers/like-controller.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

try {
    // Use { force: true } to force db to reset and pick up changes on server restart, remove to surpress
    // this behavior.
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0').then(data => {
        sequelize.sync({force: true});
    }).then(data => {
        sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    });
} catch (error) {
    console.error('Error synchronizing database:', error);
}

// Base route for user actions.
app.use('/users', userRouter);
app.use('/albums', albumRouter);
app.use('/tracks', trackRouter);
app.use('/reviews', reviewRouter);
app.use('/user-follows', userFollowRouter);
app.use('/likes', likeRouter);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});