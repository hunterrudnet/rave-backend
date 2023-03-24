import sequelize from "./index.js";
import User from "./user.js";

const UserFollow = sequelize.define("UserFollow", {});

User.belongsToMany(User, { as: "Followings", foreignKey: 'follower_id', through: UserFollow});
User.belongsToMany(User, { as: "Followers", foreignKey: 'following_id', through: UserFollow});
UserFollow.belongsTo(User, { as: "Follower", foreignKey: 'follower_id'});
UserFollow.belongsTo(User, { as: "Following", foreignKey: 'following_id'});

export default UserFollow;