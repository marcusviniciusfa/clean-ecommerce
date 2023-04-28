import { Client } from 'pg'
require('dotenv').config()

const postgresClient = new Client({
  user: process.env.DATABASE_USERNAME,
  host: 'localhost',
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: Number(process.env.DATABASE_PORT),
})

postgresClient.connect()

export { postgresClient }
