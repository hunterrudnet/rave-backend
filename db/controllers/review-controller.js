import express from "express";
import User from "../models/user.js";
import Review from "../models/review.js";
import Album from "../models/album.js";

const reviewRouter = express.Router();

reviewRouter.post("/", (req, res) => {
    // Validate request
    if (!req.body.userId && !req.body.albumId && !req.body.score) {
        res.status(400).send({
            message: "Fields can not be empty!"
        });
        return;
    }

    // Create a new user
    const review = {
        UserId: req.body.userId,
        AlbumId: req.body.albumId,
        score: req.body.score,
        reviewText: req.body.reviewText
    };

    // Save Review in the database
    // TODO: Check if review already exists for this user and album, and update it if so. Look into findOrCreate()
    Review.create(review)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Review."
            });
        });
});

reviewRouter.get("/", (req, res) => {



    // Save Review in the database
    Review.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Review."
            });
        });
});

// Route to delete a review based on a given id
reviewRouter.delete("/:review_id", (req, res) => {

    // Save Review in the database
    Review.destroy({where: {id: req.params.review_id}})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Review."
            });
        });
})

// Get all reviews for a given album
reviewRouter.get("/:albumId", (req, res) => {
    // Validate request
    if (!req.params.albumId) {
        res.status(400).send({
            message: "AlbumID can not be empty!"
        });
        return;
    }
    
    Review.findAll({where: { AlbumId: req.params.albumId }, include: [ User ]})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An Error occurred retrieving the Reviews."
            });
        });
});

// Get all reviews for a given user
reviewRouter.get("/user/:userId", (req, res) => {
    // Validate request
    if (!req.params.userId) {
        res.status(400).send({
            message: "UserID can not be empty!"
        });
        return;
    }
    
    Review.findAll({where: { UserId: req.params.userId }, include: [ Album ]})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An Error occurred retrieving the Reviews."
            });
        });
});

export default reviewRouter;