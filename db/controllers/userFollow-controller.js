import express from "express";
import UserFollow from "../models/userFollow.js";
import User from "../models/user.js";

const userFollowRouter = express.Router();

// NOTE: all paths defined here will be prepended with /users in the full path generated for the server API
// after this router is added via `app.use('/users', userRouter);` in server.js
// Create a new User with email given in request body
userFollowRouter.post("/", (req, res) => {
    // Validate request
    if (!req.body.follower_id && !req.body.following_id) {
        res.status(400).send({
            message: "Fields can not be empty!"
        });
        return;
    }

    // Create a new user
    const userFollow = {
        follower_id: req.body.follower_id,
        following_id: req.body.following_id,
    };

    // Save User in the database
    UserFollow.create(userFollow)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the UserFollow."
            });
        });
});

// Get all users that a user is following
userFollowRouter.get("/following/:userId", (req, res) => {
    // Validate request
    if (!req.params.userId) {
        res.status(400).send({
            message: "UserID can not be empty!"
        });
        return;
    }

    // Get all users that a user is following
    UserFollow.findAll({where: { follower_id: req.params.userId }, include: [ User ]})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An Error occurred retrieving the UserFollows."
            });
        });
});

// // Get all followers for a specific user
// userFollowRouter.get("/following/:userId", (req, res) => {
//     // Validate request
//     if (!req.params.userId) {
//         res.status(400).send({
//             message: "UserID can not be empty!"
//         });
//         return;
//     }
    
// });


export default userFollowRouter;