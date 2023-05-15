import { describe, expect, it } from 'vitest'
import { Coupon } from './coupon'

describe('', () => {
  it('deve criar um cupom de desconto válido', () => {
    const expireDate = new Date(new Date().getFullYear() + 1)
    const coupon = new Coupon('VALE20', 20, expireDate)
    expect(coupon.isExpired()).toBeTruthy()
  })

  it('deve criar um cupom de desconto válido', () => {
    const date = new Date(new Date().getDate() + 1)
    const coupon = new Coupon('VALE20', 20, new Date())
    expect(coupon.isExpired(date)).toBeFalsy()
  })

  it('deve calcular o desconto de um cupom válido', () => {
    const expireDate = new Date(new Date().getFullYear() + 1)
    const coupon = new Coupon('VALE20', 20, expireDate)
    expect(coupon.calculateDiscount(1000)).toBe(200)
  })
})
