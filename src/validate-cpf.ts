const CPF_PATTERN = /(\d{3})(\.?)(\d{3})(\.?)(\d{3})(\-?)(\d{2})/

export function validateCpf(rawCpf: string) {
  if (!rawCpf) {
    throw new Error('o valor para CPF está vazio')
  }
  if (typeof rawCpf !== 'string') {
    throw new Error('o valor para CPF deve ser do tipo string')
  }
  if (!CPF_PATTERN.test(rawCpf)) {
    throw new Error('o valor para CPF é diferente do padrão xxx.xxx.xxx-xx')
  }
  const cleanCpf = clearCpf(rawCpf)
  if (isBlockedCpf(cleanCpf)) {
    return false
  }
  const firstCheckDigit = calculateCheckDigit(cleanCpf, 10)
  const lastCheckDigit = calculateCheckDigit(cleanCpf, 11)
  return isCpfValidity(cleanCpf, firstCheckDigit, lastCheckDigit)
}

function clearCpf(cpf: string): string {
  return cpf.replace(/\D/g, '')
}

function isBlockedCpf(cpf: string): boolean {
  const [firstDigit] = cpf
  return [...cpf].every((digit) => digit === firstDigit)
}

function calculateCheckDigit(cpf: string, factor: number) {
  let total = 0
  for (const digit of cpf) {
    if (factor >= 2) {
      total += Number(digit) * factor--
    }
  }
  const rest = total % 11
  return rest < 2 ? 0 : 11 - rest
}

function isCpfValidity(cpf: string, firstCheckDigit: number, lastCheckDigit: number) {
  const inputCheckDigits = cpf.slice(9)
  const calculatedCheckDigits = `${firstCheckDigit}${lastCheckDigit}`
  return inputCheckDigits === calculatedCheckDigits
}
