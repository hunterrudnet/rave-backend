import sequelize from "./index.js";
import User from "./user.js";
import Album from "./album.js";
import { DataTypes } from "sequelize";

const Review = sequelize.define("Review", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    score:  {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    reviewText: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

User.belongsToMany(Album, { through: Review });
Album.belongsToMany(User, { through: Review });
Review.belongsTo(User);
Review.belongsTo(Album);

export default Review;