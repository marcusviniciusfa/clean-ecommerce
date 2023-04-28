import { beforeEach, describe, expect, it } from 'vitest'
import { ValidateCoupon } from './validate-coupon'

describe('', () => {
  let validateCoupon: ValidateCoupon

  beforeEach(() => {
    validateCoupon = new ValidateCoupon()
  })

  it('deve retornar false caso um cupom de desconto seja válido', async () => {
    const input = 'VALE20'
    const output = await validateCoupon.execute(input)
    expect(output).toBeTruthy()
  })

  it('deve retornar false caso um cupom de desconto esteja expirado', async () => {
    const input = 'VALE100'
    const output = await validateCoupon.execute(input)
    expect(output).toBeFalsy()
  })
})
