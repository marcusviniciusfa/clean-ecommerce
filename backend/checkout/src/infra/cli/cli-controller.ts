import { Checkout } from '../../application/use-cases/checkout'
import { CliHandler } from './cli-handler'

interface Input {
  cpf: string
  items: Array<{ id: number; quantity: number }>
  coupon?: string
  from?: string
  to?: string
}

export class CliController {
  constructor(readonly handler: CliHandler, readonly checkout: Checkout) {
    const input: Input = { cpf: '', items: [] }
    handler.on('set-cpf', (params: any) => {
      input.cpf = params
    })
    handler.on('add-item', (params: any) => {
      const [id, quantity] = params.split(' ')
      input.items.push({ id: Number(id), quantity: Number(quantity) })
    })
    handler.on('checkout', async (params: any) => {
      try {
        const output = await checkout.execute(input)
        handler.write(JSON.stringify(output))
      } catch (error: any) {
        handler.write(JSON.stringify({ message: error.message }))
      }
    })
  }
}
