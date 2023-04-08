import { describe, expect, it } from 'vitest'
import { validateCpf } from '.'

describe('testes do validador de CPF', () => {
  // Given
  const validCpfs: string[] = [
    '987.654.321-00',
    '714.602.380-01',
    '313.030.210-72',
    '144.796.170-60',
  ]

  it.each(validCpfs)(
    'deve retornar "true" para o CPF válido %s',
    (cpf: string) => {
      // When
      const isValid = validateCpf(cpf)
      // Then
      expect(isValid).toBeTruthy()
    },
  )

  const invalidCpfs: string[] = [
    '987.654.321-01',
    '714.602.380-00',
    '313.030.210-73',
    '144.796.170-70',
  ]

  it.each(invalidCpfs)(
    'deve retornar "false" para o CPF inválido %s',
    (cpf: string) => {
      const isValid = validateCpf(cpf)
      expect(isValid).toBeFalsy()
    },
  )

  it('deve retornar "false" para CPFs que possuam todos os dígitos iguais', () => {
    const cpf = '111.111.111-11'
    const isValid = validateCpf(cpf)
    expect(isValid).toBeFalsy()
  })

  it('deve retornar uma exception para valores vazios ("null", "undefined")', () => {
    const cpf = undefined as unknown as string
    expect(() => validateCpf(cpf)).toThrow(
      new Error('o valor para CPF está vazio'),
    )
  })

  it('deve retornar uma exception para valores que não sejam do tipo "string"', () => {
    const cpf = 98765432100 as unknown as string
    expect(() => validateCpf(cpf)).toThrow(
      new Error('o valor para CPF deve ser do tipo string'),
    )
  })

  it('deve retornar uma exception para CPFs com padrão incorreto', () => {
    const cpf = '111;444.777-35'
    expect(() => validateCpf(cpf)).toThrow(
      new Error('o valor para CPF é diferente do padrão xxx.xxx.xxx-xx'),
    )
  })
})
