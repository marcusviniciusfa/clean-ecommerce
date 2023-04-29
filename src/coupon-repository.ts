import { Coupon } from './domain/entity/coupon'

export interface CouponRepository {
  findByCode(code: string): Promise<Coupon>
}
