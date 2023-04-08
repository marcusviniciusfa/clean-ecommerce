import axios, { AxiosError } from 'axios'
import { describe, expect, it } from 'vitest'

describe('', () => {
  const headers = {
    headers: { 'content-type': 'application/json' },
  }
  it('não deve criar um pedido com CPF inválido', async () => {
    const input = { cpf: '987.654.321-01' }
    try {
      await axios.post('http://localhost:3000/checkout', input, headers)
    } catch (error) {
      expect((error as AxiosError).response?.status).toBe(400)
    }
  })

  it('deve criar um pedido vazio', async () => {
    const input = { cpf: '987.654.321-00' }
    const response = await axios.post(
      'http://localhost:3000/checkout',
      input,
      headers,
    )
    expect(response.status).toBe(201)
    expect(response.data).toHaveProperty('total', 0)
  })

  it('deve criar um pedido com 3 produtos', async () => {
    const input = {
      cpf: '987.654.321-00',
      items: [
        { id: 1, quantity: 1 }, // 5000
        { id: 2, quantity: 1 }, // 1000
        { id: 3, quantity: 3 }, // 30
      ],
    }
    const response = await axios.post(
      'http://localhost:3000/checkout',
      input,
      headers,
    )
    expect(response.status).toBe(201)
    expect(response.data).toHaveProperty('total', 6090)
  })

  it('deve criar um pedido com 3 produtos com cupom de desconto', async () => {
    const input = {
      cpf: '987.654.321-00',
      items: [
        { id: 1, quantity: 1 }, // 5000
        { id: 2, quantity: 1 }, // 1000
        { id: 3, quantity: 3 }, // 30
      ],
      coupon: 'VALE20',
    }
    const response = await axios.post('http://localhost:3000/checkout', input)
    expect(response.status).toBe(201)
    expect(response.data).toHaveProperty('total', 4872)
  })
})
