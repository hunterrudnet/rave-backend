
import express from "express";
import Like from "../models/like.js";
import Album from "../models/album.js";

const likeRouter = express.Router();


// Create a like
likeRouter.post("/", (req, res) => {
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

// Get all the liked albums for a specific user
likeRouter.get('/liked-albums/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
      const likedAlbums = await Like.findAll({
        where: { UserId: userId },
        include: [Album]
      });
      // Now, map through the response and return the albumID and spotifyAlbumID for each album
      const albumList = likedAlbums.map(like => {
        return {
          id: like.Album.id,
          spotifyId: like.Album.spotifyId
        };
      });
      
      res.send(albumList);
    } catch (err) {
        console.log(err);
      res.status(500).send({ message: "An error occurred while retrieving the liked albums." });
    }
  });

export default likeRouter;