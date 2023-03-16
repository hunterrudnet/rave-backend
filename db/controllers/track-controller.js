import express from "express";
import Track from "../models/track.js";
import spotify from "../../spotify/index.js";
import { getTrack } from "../../spotify/api.js";


const trackRouter = express.Router();

trackRouter.post("/", (req, res) => {
    // Validate request
    if (!req.body.albumId && !req.body.spotifyId) {
        res.status(400).send({
            message: "Fields can not be empty!"
        });
        return;
    }

    // Create a new track
    const track = {
        spotifyId: req.body.spotifyId,
        albumId: req.body.albumId,
    };

    // Save Track in the database
    Track.create(track)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Track."
            });
        });
});

// Retrieve a track based on spotifyID provided in request body
trackRouter.get("/:trackId", async (req, res) => {
    // Validate request
    if (!req.params.trackId) {
        res.status(400).send({
            message: "TrackID can not be empty!"
        });
        return;
    }
    getTrack(spotify, req.params.trackId).then((data) => {
        res.send(data);
    });
});

export default trackRouter;