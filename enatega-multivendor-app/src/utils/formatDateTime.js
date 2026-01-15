export const formatDateTime = (timestamp, noyear) => {
  if (!timestamp) return ''

  const date = new Date(Number(timestamp))

  const returnObj = noyear
    ? { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }
    : {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }

  return date.toLocaleString(undefined, returnObj)
}
