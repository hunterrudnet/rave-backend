import express from "express";
import Album from "../models/album.js";
import Review from "../models/review.js";
import spotify from "../../spotify/index.js";
import sequelize from "../models/index.js";
import { getAlbum, searchAlbum } from "../../spotify/api.js";
import Track from "../models/track.js";


const albumRouter = express.Router();

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
            where: {spotifyId: data.id},
            defaults: {
                name: data.name,
                image: data.images[0].url,
                artist: data.artists[0].name
            }
        }).then((album_data) => {
            console.log(album_data);
            data.tracks.items.forEach(track => {
                Track.findOrCreate({where: {spotifyId: track.id, albumId: album_data[0].dataValues.id}})
            })
        })

        res.send(response);
    });
});

// Return the average review score for an album
albumRouter.get("/review/:albumId", async (req, res) => {
    // Validate request
    if (!req.params.albumId) {
        res.status(400).send({
            message: "AlbumID can not be empty!"
        });
        return;
    }

    try {
        const result = await Review.findAll({
          attributes: [
            [sequelize.fn('AVG', sequelize.col('score')), 'averageScore'],
          ],
          where: {
            albumId: req.params.albumId,
          },
          raw: true,
        });
    
        const averageScore = parseFloat(result[0].averageScore);
        res.send({ averageScore })
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while retrieving the average review score.' })
    }
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