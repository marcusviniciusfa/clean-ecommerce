import { Item } from "./item";
import { Product } from "./product";

export class Order {
  items: Array<Item>
  total: number

  constructor(readonly cpf: string) {
    this.items = []
    this.total = 0
  }

  addItem(product: Product) {
    const index = this.items.findIndex((item) => item.id === product.id)
    if (index >= 0) {
      this.items[index].incrementQuantity()
    } else {
      this.items.push(new Item(product.id))
    }
    this.total += product.price
  }

  removeItem(product: Product) {
    const index = this.items.findIndex((item) => item.id === product.id)
    if (index >= 0) {
      const changeQuantity = this.items[index].decrementQuantity()
      if (changeQuantity) {
        this.total -= product.price
      }
    }
  }
}
