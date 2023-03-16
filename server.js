import express from "express";
import cors from "cors";
import User from "./db/models/user.js";
import Album from "./db/models/album.js";
import spotify from "./spotify/index.js";
import sequelize from "./db/models/index.js";
import userRouter from "./db/controllers/user-controller.js";
import albumRouter from "./db/controllers/album-controller.js";

const app = express();
const PORT = 8080;

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(express.json());

try {
    // Use { force: true } to force db to reset and pick up changes on server restart, remove to surpress
    // this behavior.
    await sequelize.sync({ force: true });
} catch (error) {
    console.error('Error synchronizing database:', error);
}

// Base route for user actions.
app.use('/users', userRouter);
app.use('/albums', albumRouter);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});