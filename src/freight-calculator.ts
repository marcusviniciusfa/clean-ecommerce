export class FreightCalculator {
  static calculate(product: any) {
    const volume = (product.width / 100) * (product.height / 100) * (product.depth / 100)
    const density = Number(product.weight) / volume
    const distance = 1000
    const productFreight = distance * volume * (density / 100)
    return productFreight
  }
}
