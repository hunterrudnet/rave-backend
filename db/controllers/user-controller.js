import express from "express";
import User from "../models/user.js";
import Like from "../models/like.js";
import Album from "../models/album.js";
import UserFollow from "../models/userFollow.js";
import Moderator from "../models/moderator.js";

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

    // Save User in the database
    User.findOrCreate({where: {email: req.body.email}, defaults: {
            username: req.body.username,
            name: req.body.name,
            bio: req.body.bio,
            image: req.body.image
        }})
        .then(data => {
            res.send(data[0]);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        });
});

userRouter.put("/", (req, res) => {
    // Validate request
    if (!req.body.email) {
        res.status(400).send({
            message: "Fields can not be empty!"
        });
        return;
    }

    // Create a new user
    const user = {
        username: req.body.username,
        name: req.body.name,
        bio: req.body.bio,
        image: req.body.image
    };

    // Save User in the database
    User.update(user, {where: {email: req.body.email}})
        .then(data => {
            res.status(200).send({
                message:
                     "User Successfully Updated."
            });
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

    User.findAll({where: { username: req.params.username }, include: [ Album ]})
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

const isModerator = async (userId) => {
    try {
      const moderator = await Moderator.findOne({ where: { UserId: userId } });
      if (moderator) {
        return true; // The user is a moderator
      } else {
        return false; // The user is not a moderator
      }
    } catch (err) {
      // Handle the error
      console.error(err);
      return false;
    }
}

userRouter.get('/moderator/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
      const isMod = await isModerator(userId);
      res.status(200).json({ isModerator: isMod });
    } catch (err) {
      res.status(500).send({ message: "An error occurred while checking if the user is a moderator." });
    }
});

// Turn a user into a moderator
userRouter.post("/moderator", (req, res) => {
    // Validate request
    if (!req.body.userId && !req.body.role) {
        res.status(400).send({
            message: "Fields can not be empty!"
        });
        return;
    }

    // Create a new moderator
    const moderator = {
        UserId: req.body.userId,
        role: req.body.role,
    };

    // Save User in the database
    Moderator.create(moderator)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Moderator."
            });
        });
});

export default userRouter;