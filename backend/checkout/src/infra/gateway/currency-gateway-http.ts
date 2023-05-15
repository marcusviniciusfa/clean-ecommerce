import axios from 'axios'
import { CurrencyGateway } from '../../application/gateway/currency-gateway'

export class CurrencyGatewayHttp implements CurrencyGateway {
  async getCurrencies() {
    const {
      data: { usd },
    } = await axios.get('http://localhost:3001/currencies')
    return { usd }
  }
}
