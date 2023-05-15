import { describe, expect, it } from 'vitest'
import { Cpf } from './cpf'

describe('testes do validador de CPF', () => {
  // Given
  const validCpfs: string[] = ['987.654.321-00', '714.602.380-01', '313.030.210-72', '144.796.170-60']

  it.each(validCpfs)('deve retornar "true" para o CPF válido %s', (someCpf: string) => {
    // When
    const cpf = new Cpf(someCpf)
    // Then
    expect(cpf).toBeDefined()
  })

  const invalidCpfs: string[] = ['987.654.321-01', '714.602.380-00', '313.030.210-73', '144.796.170-70']

  it.each(invalidCpfs)('deve lançar uma exception para o CPF inválido %s', (someCpf: string) => {
    expect(() => new Cpf(someCpf)).toThrowError('invalid cpf')
  })

  it('deve lançar uma exception para CPFs que possuam todos os dígitos iguais', () => {
    const someCpf = '111.111.111-11'
    expect(() => new Cpf(someCpf)).toThrowError('invalid cpf')
  })

  it('deve retornar uma exception para valores vazios ("null", "undefined")', () => {
    const someCpf = undefined as unknown as string
    expect(() => new Cpf(someCpf)).toThrow(new Error('o valor para CPF está vazio'))
  })

  it('deve retornar uma exception para valores que não sejam do tipo "string"', () => {
    const someCpf = 98765432100 as unknown as string
    expect(() => new Cpf(someCpf)).toThrow(new Error('o valor para CPF deve ser do tipo string'))
  })

  it('deve retornar uma exception para CPFs com padrão incorreto', () => {
    const someCpf = '111;444.777-35'
    expect(() => new Cpf(someCpf)).toThrow(new Error('o valor para CPF é diferente do padrão xxx.xxx.xxx-xx'))
  })
})
