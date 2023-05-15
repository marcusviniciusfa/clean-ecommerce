import { CouponRepository } from '../../../application/repositories/coupon-repository'
import { Coupon } from '../../../domain/entity/coupon'
import { DatabaseConnection } from '../database-connection'

export class CouponRepositoryDatabase implements CouponRepository {
  constructor(readonly databaseConnection: DatabaseConnection) {}
  async findByCode(code: string): Promise<Coupon> {
    const {
      rows: [couponData],
    } = await this.databaseConnection.query('select * from coupons where code = $1;', [code])
    if (!couponData) {
      throw new Error('coupon not found')
    }
    const coupon = new Coupon(couponData.code, Number(couponData.percentage), new Date(couponData.expire_date))
    return coupon
  }
}
