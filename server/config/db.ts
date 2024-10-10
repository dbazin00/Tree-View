import { Sequelize } from "sequelize";

export const sq = new Sequelize(String(process.env.POSTGRESQL_DB_URI));
