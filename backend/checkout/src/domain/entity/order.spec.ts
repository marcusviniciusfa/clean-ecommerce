import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { CurrencyTable } from './currency-table'
import { Order } from './order'
import { Product } from './product'

describe('', () => {
  it('não deve criar um pedido com o cpf inválido', () => {
    const uuid = randomUUID()
    const cpf = '987.654.321-01'
    expect(() => new Order(uuid, cpf, new CurrencyTable(), new Date(), 1)).toThrowError('invalid cpf')
  })

  it('deve criar um pedido vazio', () => {
    const uuid = randomUUID()
    const cpf = '987.654.321-00'
    const order = new Order(uuid, cpf, new CurrencyTable(), new Date(), 1)
    expect(order.getTotal()).toBe(0)
  })

  it('deve criar um pedido e gerar um código de identificação', () => {
    const uuid = randomUUID()
    const cpf = '987.654.321-00'
    const order = new Order(uuid, cpf, new CurrencyTable(), new Date('2023-01-01T10:00:00'), 1)
    order.addItem(new Product(1, 'a', 5000, 100, 30, 10, 3, 'BRL'), 1)
    expect(order.getCode()).toBe('202300000001')
  })

  it('deve criar um pedido com 3 itens', () => {
    const uuid = randomUUID()
    const cpf = '987.654.321-00'
    const order = new Order(uuid, cpf, new CurrencyTable(), new Date(), 1)
    order.addItem(new Product(1, 'a', 5000, 100, 30, 10, 3, 'BRL'), 1)
    order.addItem(new Product(2, 'b', 1000, 50, 50, 50, 22, 'BRL'), 1)
    order.addItem(new Product(3, 'c', 30, 10, 10, 10, 0.9, 'BRL'), 3)
    expect(order.getTotal()).toBe(6090)
  })

  it('deve criar um pedido com 3 itens sendo 1 em dólar', () => {
    const uuid = randomUUID()
    const cpf = '987.654.321-00'
    const currencyTable = new CurrencyTable()
    currencyTable.addCurrency('USD', 3)
    const order = new Order(uuid, cpf, currencyTable, new Date(), 1)
    order.addItem(new Product(1, 'a', 5000, 100, 30, 10, 3, 'BRL'), 1)
    order.addItem(new Product(2, 'b', 1000, 50, 50, 50, 22, 'USD'), 1)
    order.addItem(new Product(3, 'c', 30, 10, 10, 10, 0.9, 'BRL'), 3)
    expect(order.getTotal()).toBe(8090)
  })

  it('não deve criar um pedido com itens duplicados', () => {
    const uuid = randomUUID()
    const cpf = '987.654.321-00'
    const order = new Order(uuid, cpf, new CurrencyTable(), new Date(), 1)
    order.addItem(new Product(1, 'a', 5000, 100, 30, 10, 3, 'BRL'), 1)
    expect(() => order.addItem(new Product(1, 'a', 5000, 100, 30, 10, 3, 'BRL'), 1)).toThrowError('duplicated item')
  })

  it('não deve criar um pedido com uma quantidade menor ou igual a zero', () => {
    const uuid = randomUUID()
    const cpf = '987.654.321-00'
    const order = new Order(uuid, cpf, new CurrencyTable(), new Date(), 1)
    expect(() => order.addItem(new Product(1, 'a', 5000, 100, 30, 10, 3, 'BRL'), -1)).toThrowError('invalid quantity')
  })
})
