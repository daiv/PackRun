import { Sequelize } from "sequelize";
import { Client } from 'pg';
import 'dotenv/config';

const database = process.env.NODE_ENV === 'demo' ? 'demo' : (process.env.DB_NAME || "packRunDB") + (process.env.NODE_ENV === 'test' ? '_test' : '')
const sequelize: Sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  username: process.env.DB_USER_NAME || "user",
  password: process.env.DB_USER_PASSWORD || "1234",
  database
});

function createClient() {
  const client = new Client({
    user: process.env.DB_SUSER_NAME,
    host: "localhost",
    database: process.env.DB_ADMIN_NAME,
    password: process.env.DB_SUSER_PASSWORD,
    port: 5432,
  });
  return client;
}

export function newAdminDbClient() {
  const client = createClient();
  return client;
}

export async function createDatabaseIfNotExist(dbName: string | null) {
  const client = createClient();
  if (!dbName) dbName = database;
  try {
    await client.connect();
    if (dbName === 'demo') await dropDatabaseIfExists(dbName);
    await client.query('CREATE DATABASE ' + dbName);
  } catch (err) {
    console.log('Error connecting or creating database', err);
  } finally {
    await client.end();
  }
}

export async function dropDatabaseIfExists(database: string) {
  const client = createClient();
  try {
    await client.connect();
    await client.query('DROP DATABASE IF EXISTS ' + database);
  } catch (err) {
    console.log('Error al conectar o eliminar la base de datos:', err);
  } finally {
    await client.end();
  }
}

export default sequelize; 