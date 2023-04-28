import { CouponRepository } from './coupon-repository'
import { CouponRepositoryDatabase } from './coupon-repository-database'

export class ValidateCoupon {
  constructor(private readonly couponRepository: CouponRepository = new CouponRepositoryDatabase()) {}

  async execute(code: string): Promise<boolean> {
    const existentCoupon = await this.couponRepository.findByCode(code)
    return existentCoupon && existentCoupon.expires_at.getTime() >= new Date().getTime()
  }
}
