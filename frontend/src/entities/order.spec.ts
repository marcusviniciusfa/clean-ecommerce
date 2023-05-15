import { describe, expect, it } from 'vitest'
import { Order } from './order'
import { Product } from './product'

describe('', () => {
  it('deve criar um pedido', () => {
    const cpf = '987.654.321-00'
    const order = new Order(cpf)
    order.addItem(new Product('1', 'a', 5000))
    order.addItem(new Product('2', 'b', 1000))
    order.addItem(new Product('3', 'c', 30))
    order.addItem(new Product('3', 'c', 30))
    order.addItem(new Product('3', 'c', 30))
    order.addItem(new Product('3', 'c', 30))
    order.removeItem(new Product('3', 'c', 30))
    expect(order.items).toHaveLength(3)
    expect(order.total).toBe(6090)
  })
})
