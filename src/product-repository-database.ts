import { Client } from 'pg'
import { ProductRepository } from './product-repository'
require('dotenv').config()

export class ProductRepositoryDatabase implements ProductRepository {
  private postgresClient: Client

  constructor() {
    this.postgresClient = new Client({
      user: process.env.DATABASE_USERNAME,
      host: 'localhost',
      database: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      port: Number(process.env.DATABASE_PORT),
    })

    this.postgresClient.connect()
  }

  async findById(id: number): Promise<any> {
    const {
      rows: [product],
    } = await this.postgresClient.query('select * from products where id = $1;', [id])
    return product
  }
}
