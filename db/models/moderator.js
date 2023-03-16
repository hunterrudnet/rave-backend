import sequelize from "./index.js";
import {DataTypes} from "sequelize";
import User from "./user.js";

const Moderator = sequelize.define("Moderator", {
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

Moderator.belongsTo(User);

export default Moderator;