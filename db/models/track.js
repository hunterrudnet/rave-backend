import sequelize from "./index.js";
import {DataTypes} from "sequelize";
import Album from "./album.js";

const Track = sequelize.define("Track", {
    spotifyId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
})

Album.hasMany(Track, { foreignKey: "albumId", as: "tracks" });
Track.belongsTo(Album, {
  foreignKey: "albumId",
  as: "album",
});

export default Track;