import { beforeEach, describe, expect, it } from 'vitest'
import { PgAdapter } from '../../infra/database/pg-adapter'
import { ProductRepositoryDatabase } from '../../infra/database/repositories/product-repository-database'
import { SimulateFreight } from './simulate-freight'

describe('', () => {
  let simulateFreight: SimulateFreight

  beforeEach(() => {
    const databaseConnection = new PgAdapter()
    const productRepository = new ProductRepositoryDatabase(databaseConnection)
    simulateFreight = new SimulateFreight(productRepository)
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
