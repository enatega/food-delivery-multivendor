const DEFAULT_TIME_ZONE = 'Asia/Karachi'

export function createRunId(
  timestamp: Date,
  commitSha: string,
  timeZone = DEFAULT_TIME_ZONE
): string {
  if (Number.isNaN(timestamp.getTime())) {
    throw new Error('run timestamp must be valid')
  }

  const normalizedSha = commitSha.trim().toLowerCase()
  if (!/^[a-f0-9]{7,}$/.test(normalizedSha)) {
    throw new Error(
      'commit SHA must contain at least seven hexadecimal characters'
    )
  }

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit'
  }).formatToParts(timestamp)

  const value = (type: Intl.DateTimeFormatPartTypes): string => {
    const part = parts.find((candidate) => candidate.type === type)?.value
    if (!part) throw new Error(`unable to format Run ID ${type}`)
    return part
  }

  return [
    'daily',
    `${value('year')}${value('month')}${value('day')}`,
    `${value('hour')}${value('minute')}`,
    normalizedSha.slice(0, 7)
  ].join('-')
}
