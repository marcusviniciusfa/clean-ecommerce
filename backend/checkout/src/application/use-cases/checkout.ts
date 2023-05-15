import { CurrencyTable } from '../../domain/entity/currency-table'
import { FreightCalculator } from '../../domain/entity/freight-calculator'
import { Order } from '../../domain/entity/order'
import { CurrencyGatewayHttp } from '../../infra/gateway/currency-gateway-http'
import { CurrencyGateway } from '../gateway/currency-gateway'
import { CouponRepository } from '../repositories/coupon-repository'
import { OrderRepository } from '../repositories/order-repository'
import { ProductRepository } from '../repositories/product-repository'

export class Checkout {
  constructor(
    private readonly currencyGateway: CurrencyGateway = new CurrencyGatewayHttp(),
    private readonly productRepository: ProductRepository,
    private readonly couponRepository: CouponRepository,
    private readonly orderRepository: OrderRepository,
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
        freight += FreightCalculator.calculate(product, item.quantity)
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
