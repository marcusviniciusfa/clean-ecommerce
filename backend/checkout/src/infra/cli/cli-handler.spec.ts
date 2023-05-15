import { CouponRepositoryDatabase } from '../database/repositories/coupon-repository-database'
import { ProductRepositoryDatabase } from '../database/repositories/product-repository-database'
import { CliController } from './cli-controller'
/* eslint-disable prettier/prettier */
import { describe, expect, it } from 'vitest'
import { Checkout } from '../../application/use-cases/checkout'
import { PgAdapter } from '../database/pg-adapter'
import { OrderRepositoryDatabase } from '../database/repositories/order-repository-database'
import { CurrencyGatewayHttp } from '../gateway/currency-gateway-http'
import { CliHandler } from './cli-handler'

describe('', () => {
  it('deve testar a cli', async () => {
    let output = ''
    const handler = new (class extends CliHandler {
      write(text: string): void {
        output = JSON.parse(text)
      }
    })()

    const databaseConnection = new PgAdapter()
    const currencyGateway = new CurrencyGatewayHttp()
    const productRepository = new ProductRepositoryDatabase(databaseConnection)
    const couponRepository = new CouponRepositoryDatabase(databaseConnection)
    const orderRepository = new OrderRepositoryDatabase(databaseConnection)
    const checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository)
    new CliController(handler, checkout)

    handler.type('set-cpf 987.654.321-00')
    handler.type('add-item 1 1')
    await handler.type('checkout')
    expect(output).toHaveProperty('total', 5000)
    expect(output).toHaveProperty('freight', 30)
  })
})
