export class CurrencyTable {
  table: { [currency: string]: number }

  constructor() {
    this.table = {
      BRL: 1,
    }
  }

  addCurrency(currency: string, value: number) {
    this.table[currency] = value
  }

  getCurrency(currency: string) {
    if (currency in this.table) {
      return this.table[currency]
    }
    throw new Error('invalid currency')
  }
}
