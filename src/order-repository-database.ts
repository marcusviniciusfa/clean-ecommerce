import { Item } from './domain/entity/item'
import { Order } from './domain/entity/order'
import { OrderRepository } from './order-repository'
import { postgresClient } from './postgres-client'

export class OrderRepositoryDatabase implements OrderRepository {
  async save(order: Order): Promise<void> {
    await postgresClient.query('insert into orders (id, cpf, code, total, freight) values ($1, $2, $3, $4, $5)', [
      order.id,
      order.cpf,
      order.code,
      order.getTotal(),
      order.freight,
    ])
    for (const item of order.items) {
      await postgresClient.query('insert into items (id_order, id_product, price, quantity) values ($1, $2, $3, $4)', [
        order.id,
        item.id,
        item.price,
        item.quantity,
      ])
    }
  }

  async getById(id: string): Promise<Order> {
    const {
      rows: [orderData],
    } = await postgresClient.query('select * from orders where id = $1', [id])
    const order = new Order(orderData.id, orderData.cpf, undefined, new Date(), 1)
    const { rows: itemsData } = await postgresClient.query('select * from items where id_order = $1', [id])
    for (const itemData of itemsData) {
      order.items.push(new Item(itemData.id_product, itemData.price, itemData.quantity, 'BRL'))
    }
    return order
  }

  async count(): Promise<number> {
    const {
      rows: [{ count }],
    } = await postgresClient.query('select count(*) from orders')
    return Number(count)
  }
}
