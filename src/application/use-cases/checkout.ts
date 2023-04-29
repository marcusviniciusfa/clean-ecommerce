import { CouponRepository } from '../../coupon-repository'
import { CouponRepositoryDatabase } from '../../coupon-repository-database'
import { CurrencyGateway } from '../../currency-gateway'
import { CurrencyGatewayHttp } from '../../currency-gateway-http'
import { CurrencyTable } from '../../domain/entity/currency-table'
import { FreightCalculator } from '../../domain/entity/freight-calculator'
import { Order } from '../../domain/entity/order'
import { OrderRepository } from '../../order-repository'
import { OrderRepositoryDatabase } from '../../order-repository-database'
import { ProductRepository } from '../../product-repository'
import { ProductRepositoryDatabase } from '../../product-repository-database'

export class Checkout {
  constructor(
    private readonly currencyGateway: CurrencyGateway = new CurrencyGatewayHttp(),
    private readonly productRepository: ProductRepository = new ProductRepositoryDatabase(),
    private readonly couponRepository: CouponRepository = new CouponRepositoryDatabase(),
    private readonly orderRepository: OrderRepository = new OrderRepositoryDatabase(),
  ) {}

  async execute(input: Input): Promise<Output> {
    const currencies = await this.currencyGateway.getCurrencies()
    const currencyTable = new CurrencyTable()
    currencyTable.addCurrency('USD', currencies.usd)
    const sequence = await this.orderRepository.count()
    const order = new Order(input.orderId, input.cpf, currencyTable, new Date(), sequence)
    let freight = 0
    if (input.items) {
      for (const item of input.items) {
        const product = await this.productRepository.findById(item.id)
        order.addItem(product, item.quantity)
        const itemFreight = FreightCalculator.calculate(product)
        freight += Math.max(itemFreight, 10) * item.quantity
      }
    }
    if (input.from && input.to) {
      order.freight += freight
    }
    if (input.coupon) {
      const coupon = await this.couponRepository.findByCode(input.coupon)
      order.addCoupon(coupon)
    }
    const total = order.getTotal()
    await this.orderRepository.save(order)
    return {
      total,
      freight,
    }
  }
}

interface Input {
  orderId?: string
  cpf: string
  items: Array<{ id: number; quantity: number; currency?: string; price?: number }>
  coupon?: string
  from?: string
  to?: string
}

interface Output {
  total: number
  freight: number
}
