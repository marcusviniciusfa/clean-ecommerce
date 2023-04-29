import { Checkout } from './application/use-cases/checkout'

interface Input {
  cpf: string
  items: Array<{ id: number; quantity: number }>
  coupon?: string
  from?: string
  to?: string
}

const input: Input = { cpf: '', items: [] }

process.stdin.on('data', async (data) => {
  const command = data.toString().replace(/\n/, '')
  if (command.startsWith('set-cpf')) {
    input.cpf = command.replace('set-cpf ', '')
  }
  if (command.startsWith('add-item')) {
    const [id, quantity] = command.replace('add-item ', '').split(' ')
    input.items.push({ id: Number(id), quantity: Number(quantity) })
  }
  if (command.startsWith('checkout')) {
    try {
      const checkout = new Checkout()
      const output = await checkout.execute(input)
      console.log(output)
    } catch (error: any) {
      console.error({ message: error.message })
    }
  }
})
