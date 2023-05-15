export class Product {
  constructor(
    readonly id: number,
    readonly description: string,
    readonly price: number,
    readonly width: number,
    readonly height: number,
    readonly depth: number,
    readonly weight: number,
    readonly currency: string,
  ) {
    if (this.width <= 0 || this.height <= 0 || this.depth <= 0 || this.weight <= 0) {
      throw new Error('invalid dimension')
    }
  }

  getVolume(): number {
    return (this.width / 100) * (this.height / 100) * (this.depth / 100)
  }
}
