import { CouponRepository } from '../repositories/coupon-repository'

export class ValidateCoupon {
  constructor(private readonly couponRepository: CouponRepository) {}

  async execute(code: string): Promise<boolean> {
    const coupon = await this.couponRepository.findByCode(code)
    return !coupon.isExpired(new Date())
  }
}
