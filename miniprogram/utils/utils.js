export function getMaxDate() {
  const date = new Date()
  date.setTime(date.getTime() + 8 * 60 * 60 * 1000)
  return date.toISOString().slice(0, 7)
}

export function toStartEnd(start, end) {
  if (!end) {
    const date = new Date(start)
    start = date.getTime()
    date.setMonth(date.getMonth() + 1)
    return { start, end: date.getTime() }
  }
  const date = new Date(end)
  date.setMonth(date.getMonth() + 1)
  return {
    start: new Date(start).getTime(),
    end: date.getTime()
  }
}