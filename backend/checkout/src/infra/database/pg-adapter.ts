import { Client } from 'pg'
import { DatabaseConnection } from './database-connection'
require('dotenv').config()

export class PgAdapter implements DatabaseConnection {
  client: Client

  constructor() {
    this.client = new Client({
      user: process.env.DATABASE_USERNAME,
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      port: Number(process.env.DATABASE_PORT),
    })

    this.client.connect()
  }

  async query(statement: string, params: any): Promise<any> {
    return await this.client.query(statement, params)
  }

  async close(): Promise<void> {
    await this.client.end()
  }
}
