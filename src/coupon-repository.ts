export interface CouponRepository {
  findByCode(code: string): Promise<any>
}
