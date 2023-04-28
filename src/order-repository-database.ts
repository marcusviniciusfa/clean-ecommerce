import { OrderRepository } from './order-repository'
import { postgresClient } from './postgres-client'

export class OrderRepositoryDatabase implements OrderRepository {
  async save(order: any): Promise<void> {
    await postgresClient.query('insert into orders (id, cpf, code, total, freight) values ($1, $2, $3, $4, $5)', [
      order.id,
      order.cpf,
      order.code,
      order.total,
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

  async getById(id: string): Promise<any> {
    const {
      rows: [order],
    } = await postgresClient.query('select * from orders where id = $1', [id])
    return order
  }

  async count(): Promise<number> {
    const {
      rows: [{ count }],
    } = await postgresClient.query('select count(*) from orders')
    return Number(count)
  }
}
