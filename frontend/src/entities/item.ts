export class Item {
  private quantity: number

  constructor (readonly id: string) {
    this.quantity = 1
  }

  incrementQuantity() {
    this.quantity++
  }

  decrementQuantity(): boolean {
    if (this.quantity > 0) {
      this.quantity--
      return true
    }
    return false
  }

  getQuantity() {
    return this.quantity
  }
}
