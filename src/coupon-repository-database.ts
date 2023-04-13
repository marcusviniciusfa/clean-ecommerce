import { Client } from 'pg'
import { CouponRepository } from './coupon-repository'
require('dotenv').config()

export class CouponRepositoryDatabase implements CouponRepository {
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

  async findByCode(code: string): Promise<any> {
    const {
      rows: [coupon],
    } = await this.postgresClient.query('select * from coupons where code = $1;', [code])
    return coupon
  }
}
