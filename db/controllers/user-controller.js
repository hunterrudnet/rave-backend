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
userRouter.post("/", async (req, res) => {
    // Validate request
    if (!req.body.email && !req.body.username) {
        res.status(400).send({
            message: "Fields can not be empty!"
        });
        return;
    }

    try {
        // Check if the user already exists in the database
        const existingUser = await User.findOne({where: {email: req.body.email}});

        if (existingUser) {
            // If the user exists, update only the fields that are passed in
            const updateContent = {
                email: req.body.email || existingUser.email,
                username: req.body.username || existingUser.username,
                name: req.body.name || existingUser.name,
                image: req.body.image || existingUser.image,
                bio: req.body.bio !== undefined ? req.body.bio : existingUser.bio, // Use existing bio if it is not in the request body
            };

            // Update the user in the database
            await existingUser.update(updateContent);

            // Check if the user is a moderator
            const isMod = await isModerator(existingUser.id);
            // Convert the user object to a plain JavaScript object
            const userObj = existingUser.get({plain: true});
            // Add isMod field inside the user object
            userObj.isMod = isMod;

            res.send(userObj);
        } else {
            // If the user does not exist, create a new user with all the fields from the request body
            const newUserData = {
                email: req.body.email,
                username: req.body.username,
                name: req.body.name,
                image: req.body.image,
                bio: req.body.bio !== undefined ? req.body.bio : null, // Set bio to null if it is not in the request body
            };

            const newUser = await User.create(newUserData);

            // Check if the user is a moderator
            const isMod = await isModerator(newUser.id);
            // Convert the user object to a plain JavaScript object
            const userObj = newUser.get({plain: true});
            // Add isMod field inside the user object
            userObj.isMod = isMod;

            res.send(userObj);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Some error occurred while creating or updating the User."
        });
    }
});

// Get All Users
userRouter.get('/', async (req, res) => {
    // Get all users
    User.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving the Users."
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

    User.findAll({where: {username: req.params.username}, include: [Album]})
        .then(async data => {
            if (data && data.length > 0 && "dataValues" in data[0]) {
                const user = data[0].dataValues;
                const isMod = await isModerator(user.id);
                res.send({isMod: isMod, ...user});
            } else {
                res.send({});
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An Error occurred retrieving the User."
            });
        });
});

const isModerator = async (userId) => {
    try {
        const moderator = await Moderator.findOne({where: {UserId: userId}});
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
};

userRouter.get('/moderator/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const isMod = await isModerator(userId);
        res.status(200).json({isMod: isMod});
    } catch (err) {
        res.status(500).send(
            {message: "An error occurred while checking if the user is a moderator."});
    }
});

// Turn a user into a moderator
userRouter.post("/moderator", async (req, res) => {
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
        role: req.body.role
    };

    try {
        // Upsert the moderator in the database to prevent multiple moderator statuses for the same user
        const [mod, created] = await Moderator.upsert(moderator);
        if (mod) {
            res.send({role: mod.role, isMod: true});
        } else {
            res.send(mod);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message:
                err.message
                || "Some error occurred while creating/updating the Moderator."
        });
    }
});

// Remove a moderator
userRouter.delete("/moderator/:userId", async (req, res) => {
    try {
        const moderator = await Moderator.findOne(
            {where: {UserId: req.params.userId}}); // Find the moderator by UserId

        if (!moderator) {
            res.status(404).send({
                message: "Moderator not found."
            });
            return;
        }
        await moderator.destroy(); // Delete the moderator from the database

        res.send({isMod: false});
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Some error occurred while removing the Moderator."
        });
    }
});

export default userRouter;