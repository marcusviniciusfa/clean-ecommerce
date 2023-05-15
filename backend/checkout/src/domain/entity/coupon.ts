export class Coupon {
  constructor(private readonly code: string, readonly percentage: number, private readonly expireDate: Date) {}

  isExpired(date: Date = new Date()): boolean {
    return date.getTime() > this.expireDate.getTime()
  }

  calculateDiscount(amount: number): number {
    return (amount * this.percentage) / 100
  }
}
