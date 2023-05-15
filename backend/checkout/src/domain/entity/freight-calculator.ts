import { Product } from './product'

export class FreightCalculator {
  static calculate(product: Product, quantity = 1) {
    const volume = product.getVolume()
    const density = product.weight / volume
    const distance = 1000
    const freight = distance * volume * (density / 100)
    return Math.max(freight, 10) * quantity
  }
}
