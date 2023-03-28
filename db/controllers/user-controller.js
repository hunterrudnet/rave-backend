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
      message: "Fields can not be empty!",
    });
    return;
  }

  try {
    // Update or create the user in the database
    const [user, created] = await User.upsert(
      {
        email: req.body.email,
        username: req.body.username,
        name: req.body.name,
        bio: req.body.bio,
        image: req.body.image,
      },
      { returning: true } // Return the updated user object
    );

    // Check if the user is a moderator
    const isMod = await isModerator(user.id);
    // Convert the user object to a plain JavaScript object
    const userObj = user.get({ plain: true });
    // Add isMod field inside the user object
    userObj.isMod = isMod;

    res.send(userObj);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Some error occurred while creating or updating the User.",
    });
  }
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

// Remove a moderator
userRouter.delete("/moderator/:id", async (req, res) => {
  try {
    const moderator = await Moderator.findByPk(req.params.id); // Find the moderator by its ID

    if (!moderator) {
      res.status(404).send({
        message: "Moderator not found.",
      });
      return;
    }

    await moderator.destroy(); // Delete the moderator from the database

    res.send({
      message: "Moderator removed successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Some error occurred while removing the Moderator.",
    });
  }
});

export default userRouter;