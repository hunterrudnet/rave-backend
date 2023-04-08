import {Sequelize} from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_NAME || "testdb",
    process.env.DATABASE_USER || "root",
    process.env.DATABASE_PASSWORD || "",
    {
        host: process.env.DATABASE_HOST || "localhost",
        dialect: "mysql"
    });

export default sequelize;