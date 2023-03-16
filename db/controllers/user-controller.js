import express from "express";
import User from "../models/user.js";

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
userRouter.get("/lookup", (req, res) => {
    // Validate request
    if (!req.body.username) {
        res.status(400).send({
            message: "Username can not be empty!"
        });
        return;
    }


    // Retrieve any user with email matching the one provided in the request body
    User.findAll({where: { username: req.body.username }})
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

// locallost:3000/profile/username




export default userRouter;