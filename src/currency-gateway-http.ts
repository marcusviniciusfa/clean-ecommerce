import { CurrencyGateway } from './currency-gateway'

export class CurrencyGatewayHttp implements CurrencyGateway {
  async getCurrencies() {
    return {
      usd: 3 + Math.random(),
    }
  }
}
