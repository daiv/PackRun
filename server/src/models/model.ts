import { Sequelize } from "sequelize";

const sequelize: Sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  username: "db_user",
  password: "1243",
  database: "packRunDB",
});


export default sequelize; 