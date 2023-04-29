import { CouponRepository } from '../../coupon-repository'
import { CouponRepositoryDatabase } from '../../coupon-repository-database'

export class ValidateCoupon {
  constructor(private readonly couponRepository: CouponRepository = new CouponRepositoryDatabase()) {}

  async execute(code: string): Promise<boolean> {
    const coupon = await this.couponRepository.findByCode(code)
    return !coupon.isExpired(new Date())
  }
}
