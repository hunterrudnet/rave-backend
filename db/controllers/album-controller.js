import express from "express";
import Album from "../models/album.js";
import spotify from "../../spotify/index.js";
import { getAlbum, searchAlbum } from "../../spotify/api.js";
import Track from "../models/track.js";


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

    // Save Album in the database
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

// Retrieve an album based on spotifyID provided in request body
albumRouter.get("/:spotifyId", async (req, res) => {
    // Validate request
    if (!req.params.spotifyId) {
        res.status(400).send({
            message: "AlbumID can not be empty!"
        });
        return;
    }

    let response = {};
    getAlbum(spotify, req.params.spotifyId).then((data) => {
        response.id = data.id;
        response.name = data.name;
        response.images = data.images;
        response.tracks = data.tracks.items.map(track => track.name);
        response.artist = data.artists[0];

        Album.findOrCreate({
            where: {spotifyId: data.id}
        }).then((album_data) => {
            console.log(album_data);
            data.tracks.items.forEach(track => {
                Track.findOrCreate({where: {spotifyId: track.id, albumId: album_data[0].dataValues.id}})
            })
        })

        res.send(response);
    });
});

albumRouter.get("/lookup/:albumId", (req, res) => {
    // Validate request
    if (!req.params.albumId) {
        res.status(400).send({
            message: "AlbumID can not be empty!"
        });
        return;
    }

    Album.findAll({where: {id: req.params.albumId}}).then((data) => {
        if (data.length < 1) {
            res.status(500).send({
                message:
                    "Some error occurred while retrieving the album."
            });
        }

        let response = {};
        getAlbum(spotify, data[0].dataValues.spotifyId).then((data) => {
            response.id = data.id;
            response.name = data.name;
            response.images = data.images;
            response.tracks = data.tracks.items.map(track => track.name);
            response.artist = data.artists[0];

            Album.findOrCreate({
                where: {spotifyId: data.id}
            }).then((album_data) => {
                console.log(album_data);
                data.tracks.items.forEach(track => {
                    Track.findOrCreate({where: {spotifyId: track.id, albumId: album_data[0].dataValues.id}})
                })
            })

            res.send(response);
        });

    })

})

// Search spotify based on given query
albumRouter.get("/search/:query", async (req, res) => {
    // Validate request
    if (!req.params.query) {
        res.status(400).send({
            message: "Query can not be empty!"
        });
        return;
    }

    let response = [];
    searchAlbum(spotify, req.params.query).then((data) => {
        data.items.forEach(item => {
            let albumObject = {};
            albumObject.artists = item.artists;
            albumObject.external_urls = item.external_urls;
            albumObject.spotifyId = item.id;
            albumObject.images = item.images;
            albumObject.name = item.name;
            response.push(albumObject);
        })
        res.send(response);
    });
});

export default albumRouter;