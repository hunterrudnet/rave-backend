import express from "express";
import User from "../models/user.js";
import Like from "../models/like.js";
import Album from "../models/album.js";
import UserFollow from "../models/userFollow.js";

const userRouter = express.Router();

// NOTE: all paths defined here will be prepended with /users in the full path generated for the server API
// after this router is added via `app.use('/users', userRouter);` in server.js
// Create a new User with email given in request body
userRouter.post("/", (req, res) => {
    // Validate request
    if (!req.body.email && !req.body.username) {
        res.status(400).send({
            message: "Fields can not be empty!"
        });
        return;
    }

    // Create a new user
    const user = {
        email: req.body.email,
        username: req.body.username,
        bio: req.body.bio
    };

    // Save User in the database
    User.create(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        });
});

// Retrieve a user based on username provided in request body
userRouter.get("/lookup/:username", (req, res) => {
    // Validate request
    if (!req.params.username) {
        res.status(400).send({
            message: "Username can not be empty!"
        });
        return;
    }

    User.findOne({where: { username: req.params.username }, include: [ Album ]})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An Error occurred retrieving the User."
            });
        });
});

// TESTING ROUTE FOR LIKES - remove later
userRouter.post("/likes", (req, res) => {
    // Validate request
    if (!req.body.userId && !req.body.albumId) {
        res.status(400).send({
            message: "Fields can not be empty!"
        });
        return;
    }
    // Create a new like
    const like = {
        UserId: req.body.userId,
        AlbumId: req.body.albumId,
    };

    // Save User in the database
    Like.create(like)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Like."
            });
        });
});

export default userRouter;