import sequelize from "./index.js";
import {DataTypes} from "sequelize";

const Album = sequelize.define("Album", {
    spotifyId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
})

export default Album;