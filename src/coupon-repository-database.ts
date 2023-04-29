import { CouponRepository } from './coupon-repository'
import { Coupon } from './domain/entity/coupon'
import { postgresClient } from './postgres-client'

export class CouponRepositoryDatabase implements CouponRepository {
  async findByCode(code: string): Promise<Coupon> {
    const {
      rows: [couponData],
    } = await postgresClient.query('select * from coupons where code = $1;', [code])
    if (!couponData) {
      throw new Error('coupon not found')
    }
    const coupon = new Coupon(couponData.code, Number(couponData.percentage), new Date(couponData.expire_date))
    return coupon
  }
}
