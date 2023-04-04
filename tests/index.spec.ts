import { describe, expect, it } from 'vitest'
import { validate } from '../src'

describe('', () => {
  it('deve retornar true para um CPF válido', () => {
    const isValid = validate('111.444.777-35')
    expect(isValid).toBeTruthy()
  })

  it('deve retornar false para um CPF inválido', () => {
    const isValid = validate('111.444.777-05')
    expect(isValid).toBeFalsy()
  })
})
