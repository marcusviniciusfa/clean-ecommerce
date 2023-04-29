export class Cpf {
  readonly value: string

  constructor(cpf: string) {
    if (!this.validate(cpf)) {
      throw new Error('invalid cpf')
    }
    this.value = cpf
  }

  validate(rawCpf: string): boolean {
    const CPF_PATTERN = /(\d{3})(\.?)(\d{3})(\.?)(\d{3})(\-?)(\d{2})/
    if (!rawCpf) {
      throw new Error('o valor para CPF está vazio')
    }
    if (typeof rawCpf !== 'string') {
      throw new Error('o valor para CPF deve ser do tipo string')
    }
    if (!CPF_PATTERN.test(rawCpf)) {
      throw new Error('o valor para CPF é diferente do padrão xxx.xxx.xxx-xx')
    }
    const cleanCpf = this.clearCpf(rawCpf)
    if (this.isBlockedCpf(cleanCpf)) {
      return false
    }
    const firstCheckDigit = this.calculateCheckDigit(cleanCpf, 10)
    const lastCheckDigit = this.calculateCheckDigit(cleanCpf, 11)
    return this.isCpfValidity(cleanCpf, firstCheckDigit, lastCheckDigit)
  }

  clearCpf(cpf: string): string {
    return cpf.replace(/\D/g, '')
  }

  isBlockedCpf(cpf: string): boolean {
    const [firstDigit] = cpf
    return [...cpf].every((digit) => digit === firstDigit)
  }

  calculateCheckDigit(cpf: string, factor: number): number {
    let total = 0
    for (const digit of cpf) {
      if (factor >= 2) {
        total += Number(digit) * factor--
      }
    }
    const rest = total % 11
    return rest < 2 ? 0 : 11 - rest
  }

  isCpfValidity(cpf: string, firstCheckDigit: number, lastCheckDigit: number): boolean {
    const inputCheckDigits = cpf.slice(9)
    const calculatedCheckDigits = `${firstCheckDigit}${lastCheckDigit}`
    return inputCheckDigits === calculatedCheckDigits
  }
}
