import { describe, expect, it } from 'vitest'
import { FreightCalculator } from './freight-calculator'

describe('', () => {
  it('deve calcular o frete de um produto', () => {
    const product = { price: 5000, width: 100, height: 30, depth: 10, weight: 3 }
    const freight = FreightCalculator.calculate(product)
    expect(freight).toBe(30)
  })
})
