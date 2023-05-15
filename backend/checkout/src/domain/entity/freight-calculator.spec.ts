import { describe, expect, it } from 'vitest'
import { FreightCalculator } from './freight-calculator'
import { Product } from './product'

describe('', () => {
  it('deve calcular o frete de um produto com quantidade 1', () => {
    const product = new Product(6, 'a', 5000, 100, 30, 10, 3, 'USD')
    const freight = FreightCalculator.calculate(product)
    expect(freight).toBe(30)
  })

  it('deve calcular o frete de um produto com quantidade 3', () => {
    const product = new Product(6, 'a', 5000, 100, 30, 10, 3, 'USD')
    const freight = FreightCalculator.calculate(product, 3)
    expect(freight).toBe(90)
  })

  it('deve calcular o frete de um produto com preço mínimo', () => {
    const product = new Product(7, 'b', 1000, 10, 10, 10, 0.9, 'USD')
    const freight = FreightCalculator.calculate(product)
    expect(freight).toBe(10)
  })
})
