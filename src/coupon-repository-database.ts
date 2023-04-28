import { CouponRepository } from './coupon-repository'
import { postgresClient } from './postgres-client'

export class CouponRepositoryDatabase implements CouponRepository {
  async findByCode(code: string): Promise<any> {
    const {
      rows: [coupon],
    } = await postgresClient.query('select * from coupons where code = $1;', [code])
    return coupon
  }
}
