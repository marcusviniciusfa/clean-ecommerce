import { randomUUID } from 'node:crypto'
import { Coupon } from './coupon'
import { Cpf } from './cpf'
import { CurrencyTable } from './currency-table'
import { Item } from './item'
import { Product } from './product'

export class Order {
  readonly items: Array<Item>
  readonly cpf: Cpf
  readonly code: string
  private coupon?: Coupon
  freight: number

  constructor(
    readonly id: string = randomUUID(),
    cpf: string,
    readonly currencyTable: CurrencyTable = new CurrencyTable(),
    readonly date: Date = new Date(),
    readonly sequence: number,
  ) {
    this.items = []
    this.cpf = new Cpf(cpf)
    this.code = `${date.getFullYear()}${sequence.toString().padStart(8, '0')}`
    this.freight = 0
  }

  addItem(product: Product, quantity: number) {
    if (quantity <= 0) {
      throw new Error('invalid quantity')
    }
    const alreadyExistsItem = this.items.some((item) => item.id === product.id)
    if (alreadyExistsItem) {
      throw new Error('duplicated item')
    }
    this.items.push(new Item(product.id, product.price, quantity, product.currency))
  }

  addCoupon(coupon: Coupon) {
    if (!coupon.isExpired(this.date)) {
      this.coupon = coupon
    }
  }

  getCode() {
    return this.code
  }

  getTotal() {
    let total = 0
    for (const item of this.items) {
      total += item.price * item.quantity * this.currencyTable.getCurrency(item.currency)
    }
    total += this.freight
    if (this.coupon) {
      total -= this.coupon.calculateDiscount(total)
    }
    return total
  }
}
