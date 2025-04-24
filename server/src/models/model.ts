import { Sequelize } from "sequelize";
import 'dotenv/config';


 const sequelize: Sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  username: process.env.DB_USER_NAME || "user",
  password: process.env.DB_USER_PASSWORD || "1234",
  database: (process.env.DB_NAME || "packRunDB") + (process.env.NODE_ENV === 'test' ? '_test' : '')
}); 


export default sequelize; 