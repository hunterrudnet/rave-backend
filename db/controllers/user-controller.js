import express from "express";
import User from "../models/user.js";

const userRouter = express.Router();

// NOTE: all paths defined here will be prepended with /users in the full path generated for the server API
// after this router is added via `app.use('/users', userRouter);` in server.js
// Create a new User with email given in request body
userRouter.post("/", (req, res) => {
    // Validate request
    if (!req.body.email) {
        res.status(400).send({
            message: "Email can not be empty!"
        });
        return;
    }

    // Create a new user
    const user = {
        email: req.body.email
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

// Retrieve a user based on email provided in request body
userRouter.get("/lookup", (req, res) => {
    // Validate request
    if (!req.body.email) {
        res.status(400).send({
            message: "Email can not be empty!"
        });
        return;
    }


    // Retrieve any user with email matching the one provided in the request body
    User.findAll({where: { email: req.body.email }})
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




export default userRouter;