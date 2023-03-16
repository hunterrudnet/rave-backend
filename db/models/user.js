import sequelize from "./index.js";
import {DataTypes} from "sequelize";

const User = sequelize.define("User", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
})

export default User;