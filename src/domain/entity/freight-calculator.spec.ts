import { describe, expect, it } from 'vitest'
import { FreightCalculator } from './freight-calculator'
import { Product } from './product'

describe('', () => {
  it('deve calcular o frete de um produto', () => {
    const product = new Product(6, 'a', 5000, 100, 30, 10, 3, 'USD')
    const freight = FreightCalculator.calculate(product)
    expect(freight).toBe(30)
  })
})
