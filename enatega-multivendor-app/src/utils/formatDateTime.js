export const formatDateTime = (timestamp, noYear = false) => {
  if (!timestamp) return ''

  const numericTimestamp = Number(timestamp)
  const date = new Date(
    Number.isFinite(numericTimestamp) ? numericTimestamp : timestamp
  )
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleString(undefined, noYear
    ? { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }
    : {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
}

