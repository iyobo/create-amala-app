const MAX_SLUG_LENGTH = 30

export function toBoolean(value) {
  if (value === true || value === 'true') {
    return true
  }
  if (!value || value === 'false') {
    return false
  }

  throw new Error(`${value} is not a boolean`)
}

export function toNumber(value) {
  if (!value) return null
  return Number.parseInt(value)
}

export function stringifyAddress({ address1, address2, city, state, postalCode, country }) {
  return `${address1} ${address2}, ${city} ${state} ${postalCode}, ${country}`
}

export function slugify(value: string): string {
  if (!value) return ''
  let v = value
  if (v.length > MAX_SLUG_LENGTH) {
    v = v.substr(0, MAX_SLUG_LENGTH)
  }
  return v
    .toLowerCase()
    .replaceAll(' ', '-')
    .replaceAll(/[^a-zA-Z0-9/-]/g, '')
}

export function toHashmap<T>(array: T[], byKey: keyof T | string = 'id'): Record<string, T> {
  const map: Record<string, T> = {}
  array?.forEach((it) => {
    map[it[byKey as string]] = it
  })

  return map
}
