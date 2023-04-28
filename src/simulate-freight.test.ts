import { beforeEach, describe, expect, it } from 'vitest'
import { SimulateFreight } from './simulate-freight'

describe('', () => {
  let simulateFreight: SimulateFreight

  beforeEach(() => {
    simulateFreight = new SimulateFreight()
  })

  it('deve calcular o frete para uma simulação de frete', async () => {
    const input = {
      items: [{ id: 1, quantity: 3 }],
      from: '22060030',
      to: '88015600',
    }
    const output = await simulateFreight.execute(input)
    expect(output).toHaveProperty('freight', 90)
  })
})
