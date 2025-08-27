export function getMaxDate() {
  const date = new Date()
  date.setTime(date.getTime() + 8 * 60 * 60 * 1000)
  return date.toISOString().slice(0, 7)
}