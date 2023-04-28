import { CouponRepository } from './coupon-repository'
import { CouponRepositoryDatabase } from './coupon-repository-database'
import { CurrencyGateway } from './currency-gateway'
import { CurrencyGatewayHttp } from './currency-gateway-http'
import { FreightCalculator } from './freight-calculator'
import { OrderRepository } from './order-repository'
import { OrderRepositoryDatabase } from './order-repository-database'
import { ProductRepository } from './product-repository'
import { ProductRepositoryDatabase } from './product-repository-database'
import { validateCpf } from './validate-cpf'

export class Checkout {
  constructor(
    private readonly currencyGateway: CurrencyGateway = new CurrencyGatewayHttp(),
    private readonly productRepository: ProductRepository = new ProductRepositoryDatabase(),
    private readonly couponRepository: CouponRepository = new CouponRepositoryDatabase(),
    private readonly orderRepository: OrderRepository = new OrderRepositoryDatabase(),
  ) {}

  async execute(input: Input): Promise<Output> {
    const { items, cpf, coupon, from, to, orderId } = input
    const isValid = validateCpf(cpf)
    if (!isValid) {
      throw new Error('invalid cpf')
    }
    const output: Output = {
      total: 0,
      code: 201,
      freight: 0,
    }
    const addedItems: number[] = []
    if (items) {
      for (const item of items) {
        if (item.quantity <= 0) {
          throw new Error('invalid quantity')
        }
        if (addedItems.includes(item.id)) {
          throw new Error('duplicated items')
        }
        const product = await this.productRepository.findById(item.id)
        if (product.width <= 0 || product.height <= 0 || product.depth <= 0 || Number(product.weight) <= 0) {
          throw new Error('invalid dimension')
        }
        addedItems.push(item.id)
        output.total += Number(product.price) * item.quantity
        const currencies = await this.currencyGateway.getCurrencies()
        if (item.currency === 'USD') {
          output.total *= currencies.usd
        }
        const productFreight = FreightCalculator.calculate(product)
        output.freight += Math.max(productFreight, 10) * item.quantity
        item.price = Number(product.price)
      }
      if (coupon) {
        const existentCoupon = await this.couponRepository.findByCode(coupon)
        if (existentCoupon && existentCoupon.expires_at.getTime() >= new Date().getTime()) {
          output.total -= output.total * (Number(existentCoupon.percentage) / 100)
        }
      }
      if (from && to) {
        output.total += output.freight
      }
    }
    const year = new Date().getFullYear()
    const sequence = this.orderRepository.count()
    const code = `${year}${(await sequence).toString().padStart(8, '0')}`
    const order = {
      id: orderId,
      total: output.total,
      freight: output.freight,
      code,
      cpf,
      items: items,
    }
    await this.orderRepository.save(order)
    return output
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
  code: number
  freight: number
}
