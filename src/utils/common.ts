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
