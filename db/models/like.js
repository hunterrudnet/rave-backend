import sequelize from "./index.js";
import User from "./user.js";
import Album from "./album.js";

const Like = sequelize.define("Like", {});

User.belongsToMany(Album, {through: Like});
Album.belongsToMany(User, {through: Like});

// Define the association between the Like and Album models
Like.belongsTo(Album);
Album.hasMany(Like);
User.hasMany(Like);
Like.belongsTo(User);

export default Like;