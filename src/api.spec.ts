import axios, { AxiosError } from 'axios'
import { describe, expect, it } from 'vitest'

describe('', () => {
  it('não deve criar um pedido com CPF inválido', async () => {
    const input = { cpf: '987.654.321-01', items: [] }
    try {
      await axios.post('http://localhost:3000/checkout', input)
    } catch (error) {
      expect((error as AxiosError).response?.status).toBe(400)
      expect((error as AxiosError).response?.data).toHaveProperty('message', 'invalid cpf')
    }
  })

  it('deve criar um pedido vazio', async () => {
    const input = { cpf: '987.654.321-00', items: [] }
    const response = await axios.post('http://localhost:3000/checkout', input)
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
    const response = await axios.post('http://localhost:3000/checkout', input)
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

  it('não deve aplicar um cupom de desconto expirado', async () => {
    const input = {
      cpf: '987.654.321-00',
      items: [
        { id: 1, quantity: 1 }, // 5000
        { id: 2, quantity: 1 }, // 1000
        { id: 3, quantity: 3 }, // 30
      ],
      coupon: 'BLACKFRIDAY',
    }
    const response = await axios.post('http://localhost:3000/checkout', input)
    expect(response.status).toBe(201)
    expect(response.data).toHaveProperty('total', 6090)
  })

  it('não deve criar um pedido com quantidade negativa', async () => {
    const input = {
      cpf: '987.654.321-00',
      items: [{ id: 1, quantity: -1 }],
    }
    try {
      await axios.post('http://localhost:3000/checkout', input)
    } catch (error) {
      expect((error as AxiosError).response?.status).toBe(400)
      expect((error as AxiosError).response?.data).toHaveProperty('message', 'invalid quantity')
    }
  })

  it('não deve criar um pedido itens duplicados', async () => {
    const input = {
      cpf: '987.654.321-00',
      items: [
        { id: 1, quantity: 1 },
        { id: 1, quantity: 1 },
      ],
    }
    try {
      await axios.post('http://localhost:3000/checkout', input)
    } catch (error) {
      expect((error as AxiosError).response?.status).toBe(400)
      expect((error as AxiosError).response?.data).toHaveProperty('message', 'duplicated item')
    }
  })

  it('deve criar um pedido com 1 produto calculando o frete', async () => {
    const input = {
      cpf: '987.654.321-00',
      items: [{ id: 1, quantity: 3 }],
      from: '22060030',
      to: '88015600',
    }
    const response = await axios.post('http://localhost:3000/checkout', input)
    expect(response.status).toBe(201)
    expect(response.data).toHaveProperty('freight', 90)
    expect(response.data).toHaveProperty('total', 15090)
  })

  it('não deve criar um pedido se o produto tiver alguma dimensão menor que zero', async () => {
    const input = {
      cpf: '987.654.321-00',
      items: [{ id: 4, quantity: 1 }],
    }
    try {
      await axios.post('http://localhost:3000/checkout', input)
    } catch (error) {
      expect((error as AxiosError).response?.status).toBe(400)
      expect((error as AxiosError).response?.data).toHaveProperty('message', 'invalid dimension')
    }
  })

  it('deve criar um pedido com 1 produto calculando o frete com o valor mínimo', async () => {
    const input = {
      cpf: '987.654.321-00',
      items: [{ id: 3, quantity: 1 }],
      from: '22060030',
      to: '88015600',
    }
    const response = await axios.post('http://localhost:3000/checkout', input)
    expect(response.status).toBe(201)
    expect(response.data).toHaveProperty('freight', 10)
    expect(response.data).toHaveProperty('total', 40)
  })
})
