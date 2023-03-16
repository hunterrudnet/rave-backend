import express from "express";
import Album from "../models/album.js";
import spotify from "../../spotify/index.js";
import { getAlbum, searchAlbum } from "../../spotify/api.js";


const albumRouter = express.Router();

albumRouter.post("/", (req, res) => {
    // Validate request
    if (!req.body.spotifyId) {
        res.status(400).send({
            message: "Album ID can not be empty!"
        });
        return;
    }

    // Create a new user
    const album = {
        spotifyId: req.body.spotifyId,
    };

    // Save User in the database
    Album.create(album)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Album."
            });
        });
});

// Retrieve a user based on spotifyID provided in request body
albumRouter.get("/:albumId", async (req, res) => {
    // Validate request
    if (!req.params.albumId) {
        res.status(400).send({
            message: "AlbumID can not be empty!"
        });
        return;
    }
    getAlbum(spotify, req.params.albumId).then((data) => {
        // TODO: Create track objects in our database for each track in the album
        res.send(data);
    });
});

// Retrieve a user based on spotifyID provided in request body
albumRouter.get("/search/:query", async (req, res) => {
    // Validate request
    if (!req.params.query) {
        res.status(400).send({
            message: "Query can not be empty!"
        });
        return;
    }
    searchAlbum(spotify, req.params.query).then((data) => {
        res.send(data);
    });
});

export default albumRouter;