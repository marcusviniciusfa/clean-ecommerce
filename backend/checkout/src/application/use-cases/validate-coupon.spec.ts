import { beforeEach, describe, expect, it } from 'vitest'
import { PgAdapter } from '../../infra/database/pg-adapter'
import { CouponRepositoryDatabase } from '../../infra/database/repositories/coupon-repository-database'
import { ValidateCoupon } from './validate-coupon'

describe('', () => {
  let validateCoupon: ValidateCoupon

  beforeEach(() => {
    const databaseConnection = new PgAdapter()
    const couponRepository = new CouponRepositoryDatabase(databaseConnection)
    validateCoupon = new ValidateCoupon(couponRepository)
  })

  it('deve retornar true caso um cupom de desconto seja válido', async () => {
    const input = 'VALE20'
    const output = await validateCoupon.execute(input)
    expect(output).toBeTruthy()
  })

  it('deve retornar false caso um cupom de desconto seja inválido', async () => {
    const input = 'BLACKFRIDAY'
    const output = await validateCoupon.execute(input)
    expect(output).toBeFalsy()
  })

  it('deve retornar false caso um cupom de desconto esteja expirado', async () => {
    const input = 'VALE100'
    expect(async () => await validateCoupon.execute(input)).rejects.toThrowError('coupon not found')
  })
})
