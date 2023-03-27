import sequelize from "./index.js";
import {DataTypes} from "sequelize";

const Album = sequelize.define("Album", {
    spotifyId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    artist: {
        type: DataTypes.STRING,
        allowNull: false
    },
})

export default Album;