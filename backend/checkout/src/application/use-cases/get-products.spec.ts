import { describe, expect, it } from 'vitest'
import { PgAdapter } from './../../infra/database/pg-adapter'
import { ProductRepositoryDatabase } from './../../infra/database/repositories/product-repository-database'
import { GetProducts } from './get-products'

describe('', () => {
  it('deve listar os produtos', async () => {
    const databaseConnection = new PgAdapter()
    const productRepository = new ProductRepositoryDatabase(databaseConnection)
    const getProducts = new GetProducts(productRepository)
    const output = await getProducts.execute()
    expect(output).toHaveLength(3)
  })
})
