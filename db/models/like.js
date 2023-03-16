import sequelize from "./index.js";
import User from "./user.js";
import Album from "./album.js";

const Like = sequelize.define("Like", {});

User.belongsToMany(Album, { through: Like });
Album.belongsToMany(User, { through: Like });

export default Like;