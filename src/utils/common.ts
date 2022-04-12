/**
 * Create random integer between min~max.
 * @param min Min number.
 * @param max Max number.
 */
export function createRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min
}

/**
 * Get fixed Number.
 * @param num Number.
 * @param fractionDigits Digits.
 */
export function getFixedNumber(num: number, fractionDigits?: number) {
  return parseFloat(num.toFixed(fractionDigits))
}

/**
 * Get speed meters per second
 * @param KiloMetersPerHour Speed, kilometers per hour.
 */
export function getMetersPerSecond(KiloMetersPerHour: number) {
  return KiloMetersPerHour / 3.6
}
