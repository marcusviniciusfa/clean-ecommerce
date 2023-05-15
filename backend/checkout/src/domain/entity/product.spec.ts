import { describe, expect, it } from 'vitest'
import { Product } from './product'

describe('', () => {
  it('não deve criar um produto com dimensões inválidas', () => {
    expect(() => new Product(1, 'a', 5000, 100, -30, 10, 3, 'BRL')).toThrowError('invalid dimension')
  })
})
