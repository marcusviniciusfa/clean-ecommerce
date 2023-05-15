import { randomUUID } from 'node:crypto'
import sinon from 'sinon'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { Product } from '../../domain/entity/product'
import { DatabaseConnection } from '../../infra/database/database-connection'
import { PgAdapter } from '../../infra/database/pg-adapter'
import { CouponRepositoryDatabase } from '../../infra/database/repositories/coupon-repository-database'
import { OrderRepositoryDatabase } from '../../infra/database/repositories/order-repository-database'
import { ProductRepositoryDatabase } from '../../infra/database/repositories/product-repository-database'
import { CurrencyGatewayHttp } from '../../infra/gateway/currency-gateway-http'
import { CurrencyGateway } from '../gateway/currency-gateway'
import { CouponRepository } from '../repositories/coupon-repository'
import { OrderRepository } from '../repositories/order-repository'
import { ProductRepository } from '../repositories/product-repository'
import { Checkout } from './checkout'
import { GetOrder } from './get-order'

describe('', () => {
  let checkout: Checkout
  let getOrder: GetOrder
  let databaseConnection: DatabaseConnection
  let currencyGateway: CurrencyGateway
  let productRepository: ProductRepository
  let couponRepository: CouponRepository
  let orderRepository: OrderRepository

  beforeEach(() => {
    vi.resetAllMocks()
    sinon.restore()
    databaseConnection = new PgAdapter()
    currencyGateway = new CurrencyGatewayHttp()
    productRepository = new ProductRepositoryDatabase(databaseConnection)
    couponRepository = new CouponRepositoryDatabase(databaseConnection)
    orderRepository = new OrderRepositoryDatabase(databaseConnection)
    getOrder = new GetOrder(orderRepository)
    checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository)
  })

  afterAll(async () => {
    await databaseConnection.close()
  })

  it('não deve criar um pedido com CPF inválido', async () => {
    const input = { cpf: '987.654.321-01', items: [] }
    expect(async () => await checkout.execute(input)).rejects.toThrowError('invalid cpf')
  })

  it('deve criar um pedido vazio', async () => {
    const input = { cpf: '987.654.321-00', items: [] }
    const output = await checkout.execute(input)
    expect(output).toHaveProperty('total', 0)
  })

  it('deve criar um pedido com 3 produtos', async () => {
    const id = randomUUID()
    const input = {
      cpf: '987.654.321-00',
      items: [
        { id: 1, quantity: 1 }, // 5000
        { id: 2, quantity: 1 }, // 1000
        { id: 3, quantity: 3 }, // 30
      ],
      orderId: id,
    }
    await checkout.execute(input)
    const output = await getOrder.execute(id)
    expect(output).toHaveProperty('total', 6090)
  })

  it('deve criar um pedido com 3 produtos com cupom de desconto', async () => {
    const input = {
      cpf: '987.654.321-00',
      items: [
        { id: 1, quantity: 1 }, // 5000
        { id: 2, quantity: 1 }, // 1000
        { id: 3, quantity: 3 }, // 30
      ],
      coupon: 'VALE20',
    }
    const output = await checkout.execute(input)
    expect(output).toHaveProperty('total', 4872)
  })

  it('não deve aplicar um cupom de desconto expirado', async () => {
    const input = {
      cpf: '987.654.321-00',
      items: [
        { id: 1, quantity: 1 }, // 5000
        { id: 2, quantity: 1 }, // 1000
        { id: 3, quantity: 3 }, // 30
      ],
      coupon: 'BLACKFRIDAY',
    }
    const output = await checkout.execute(input)
    expect(output).toHaveProperty('total', 6090)
  })

  it('não deve criar um pedido com quantidade negativa', async () => {
    const input = {
      cpf: '987.654.321-00',
      items: [{ id: 1, quantity: -1 }],
    }
    expect(async () => await checkout.execute(input)).rejects.toThrowError('invalid quantity')
  })

  it('não deve criar um pedido itens duplicados', async () => {
    const input = {
      cpf: '987.654.321-00',
      items: [
        { id: 1, quantity: 1 },
        { id: 1, quantity: 1 },
      ],
    }
    expect(async () => await checkout.execute(input)).rejects.toThrowError('duplicated item')
  })

  it('deve criar um pedido com 1 produto calculando o frete', async () => {
    const input = {
      cpf: '987.654.321-00',
      items: [{ id: 1, quantity: 3 }],
      from: '22060030',
      to: '88015600',
    }
    const output = await checkout.execute(input)
    expect(output).toHaveProperty('freight', 90)
    expect(output).toHaveProperty('total', 15090)
  })

  it('não deve criar um pedido se o produto tiver alguma dimensão menor que zero', async () => {
    const input = {
      cpf: '987.654.321-00',
      items: [{ id: 4, quantity: 1 }],
    }
    expect(async () => await checkout.execute(input)).rejects.toThrowError('invalid dimension')
  })

  it('deve criar um pedido com 1 produto calculando o frete com o valor mínimo', async () => {
    const input = {
      cpf: '987.654.321-00',
      items: [{ id: 3, quantity: 1 }],
      from: '22060030',
      to: '88015600',
    }
    const output = await checkout.execute(input)
    expect(output).toHaveProperty('freight', 10)
    expect(output).toHaveProperty('total', 40)
  })

  it('deve criar um pedido com 1 produto em dólar (stub CurrencyGatewayHttp com vitest)', async () => {
    const currencyGatewayStub = new CurrencyGatewayHttp()
    currencyGatewayStub.getCurrencies = vi.fn().mockResolvedValue({ usd: 3 })
    checkout = new Checkout(currencyGatewayStub, productRepository, couponRepository, orderRepository)
    const input = {
      cpf: '987.654.321-00',
      items: [{ id: 5, quantity: 1, currency: 'USD' }],
    }
    const output = await checkout.execute(input)
    expect(output.total).toBe(3000)
  })

  it('deve criar um pedido com 1 produto em dólar (stub CurrencyGatewayHttp com sinon)', async () => {
    const currencyGatewayStub = sinon.stub(CurrencyGatewayHttp.prototype, 'getCurrencies')
    currencyGatewayStub.resolves({ usd: 3 })
    const input = {
      cpf: '987.654.321-00',
      items: [{ id: 5, quantity: 1, currency: 'USD' }],
    }
    const output = await checkout.execute(input)
    expect(output.total).toBe(3000)
  })

  it('deve criar um pedido com 1 produto em dólar (spy CurrencyGatewayHttp.getCurrencies com vitest)', async () => {
    const currencyGatewayForSpy = new CurrencyGatewayHttp()
    const getCurrenciesSpy = vi.spyOn(currencyGatewayForSpy, 'getCurrencies')
    checkout = new Checkout(currencyGatewayForSpy, productRepository, couponRepository, orderRepository)
    const input = {
      cpf: '987.654.321-00',
      items: [{ id: 5, quantity: 1, currency: 'USD' }],
    }
    await checkout.execute(input)
    await checkout.execute(input)
    // check spy
    expect(getCurrenciesSpy).toHaveBeenCalledTimes(2)
  })

  it('deve criar um pedido com 1 produto em dólar (spy CurrencyGatewayHttp.getCurrencies com sinon)', async () => {
    const getCurrenciesSpy = sinon.spy(CurrencyGatewayHttp.prototype, 'getCurrencies')
    const input = {
      cpf: '987.654.321-00',
      items: [{ id: 5, quantity: 1, currency: 'USD' }],
    }
    await checkout.execute(input)
    await checkout.execute(input)
    expect(getCurrenciesSpy.callCount).toBe(2)
  })

  it('deve criar um pedido com 1 produto em dólar (mock CurrencyGatewayHttp com sinon)', async () => {
    const currentGatewayMock = sinon.mock(CurrencyGatewayHttp.prototype)
    currentGatewayMock.expects('getCurrencies').once().resolves({
      usd: 3,
    })
    const input = {
      cpf: '987.654.321-00',
      items: [{ id: 5, quantity: 1, currency: 'USD' }],
    }
    const output = await checkout.execute(input)
    currentGatewayMock.verify()
    expect(output.total).toBe(3000)
  })

  it('deve criar um pedido com 1 produto em dólar (fake CurrencyGateway)', async () => {
    const currencyGatewayFake: CurrencyGateway = {
      async getCurrencies(): Promise<any> {
        return { usd: 3.5 }
      },
    }
    checkout = new Checkout(currencyGatewayFake, productRepository, couponRepository, orderRepository)
    const input = {
      cpf: '987.654.321-00',
      items: [{ id: 5, quantity: 1, currency: 'USD' }],
    }
    const output = await checkout.execute(input)
    expect(output.total).toBe(3500)
  })

  it('deve criar um pedido com 1 produto em dólar (fake ProductRepository)', async () => {
    const currencyGatewayFake: CurrencyGateway = {
      async getCurrencies(): Promise<any> {
        return { usd: 3.45 }
      },
    }
    const productRepositoryFake: ProductRepository = {
      findById: (id: number): Promise<Product> => {
        return Promise.resolve(new Product(100, 'a', 7000, 1, 1, 1, 1, 'USD'))
      },
      findAll: (): Promise<Product[]> => {
        return Promise.resolve([])
      },
    }
    checkout = new Checkout(currencyGatewayFake, productRepositoryFake, couponRepository, orderRepository)
    const input = {
      cpf: '987.654.321-00',
      items: [{ id: 100, quantity: 1, currency: 'USD' }],
    }
    const output = await checkout.execute(input)
    expect(output.total).toBe(24150)
  })

  it('deve criar um pedido e verificar o código do pedido', async () => {
    const id = randomUUID()
    const input = {
      cpf: '987.654.321-00',
      items: [
        { id: 1, quantity: 1 }, // 5000
        { id: 2, quantity: 1 }, // 1000
        { id: 3, quantity: 3 }, // 30
      ],
      orderId: id,
    }
    // sinon.stub(OrderRepositoryDatabase.prototype, 'count').resolves(1)
    OrderRepositoryDatabase.prototype.count = () => Promise.resolve(1)
    await checkout.execute(input)
    const output = await getOrder.execute(id)
    expect(output).toHaveProperty('code', '202300000001')
  })
})
