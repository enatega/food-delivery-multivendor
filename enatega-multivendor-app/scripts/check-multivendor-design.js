const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')
const sourceRoots = [
  path.join(projectRoot, 'src', 'screens'),
  path.join(projectRoot, 'src', 'components'),
  path.join(projectRoot, 'src', 'routes'),
  path.join(projectRoot, 'src', 'ui', 'designSystem')
]
const baselinePath = path.join(__dirname, 'multivendor-design-baseline.json')
const updateBaseline = process.argv.includes('--update-baseline')

const rules = [
  {
    id: 'hardcoded-light-border',
    message: 'Use semantic borderSubtle/borderStandard instead of a fixed light border.',
    pattern: /border(?:Top|Right|Bottom|Left)?Color\s*:\s*['"](?:white|#fff(?:fff)?|#f9f9f9|#efefef|#e5e7eb)['"]/i
  },
  {
    id: 'solid-separator-width',
    message: 'Use StyleSheet.hairlineWidth for top and bottom separators.',
    pattern: /border(?:Top|Bottom)Width\s*:\s*(?:1|scale\(\s*1\s*\))/
  },
  {
    id: 'legacy-separator-token',
    message: 'Use a semantic border token instead of a legacy separator token.',
    pattern: /\b(?:currentTheme|theme|props)(?:\?\.)?\.(?:horizontalLine|verticalLine|borderBottomColor)\b/
  },
  {
    id: 'hardcoded-light-surface',
    message: 'Use a semantic surface token instead of a fixed white background.',
    pattern: /backgroundColor\s*:\s*['"](?:white|#fff(?:fff)?)['"]/i
  }
]

const extensions = new Set(['.js', '.jsx', '.ts', '.tsx'])

const collectFiles = (directory) => {
  if (!fs.existsSync(directory)) return []
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return collectFiles(entryPath)
    return extensions.has(path.extname(entry.name)) ? [entryPath] : []
  })
}

const normalizeLine = (line) => line.trim().replace(/\s+/g, ' ')

const findings = sourceRoots
  .flatMap(collectFiles)
  .flatMap((filePath) => {
    const relativePath = path.relative(projectRoot, filePath)
    return fs.readFileSync(filePath, 'utf8').split(/\r?\n/).flatMap((line, index) => {
      const normalized = normalizeLine(line)
      if (!normalized || normalized.startsWith('//')) return []

      return rules
        .filter((rule) => rule.pattern.test(line))
        .map((rule) => ({
          fingerprint: `${relativePath}|${rule.id}|${normalized}`,
          file: relativePath,
          line: index + 1,
          rule: rule.id,
          message: rule.message,
          source: normalized
        }))
    })
  })

const uniqueFindings = [...new Map(findings.map((finding) => [finding.fingerprint, finding])).values()]
  .sort((a, b) => a.fingerprint.localeCompare(b.fingerprint))

if (updateBaseline) {
  fs.writeFileSync(
    baselinePath,
    `${JSON.stringify({ fingerprints: uniqueFindings.map(({ fingerprint }) => fingerprint) }, null, 2)}\n`
  )
  console.log(`Updated multivendor design baseline with ${uniqueFindings.length} legacy findings.`)
  process.exit(0)
}

if (!fs.existsSync(baselinePath)) {
  console.error('Design baseline is missing. Run npm run update:multivendor-design-baseline.')
  process.exit(1)
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'))
const baselineFingerprints = new Set(baseline.fingerprints || [])
const currentFingerprints = new Set(uniqueFindings.map(({ fingerprint }) => fingerprint))
const newFindings = uniqueFindings.filter(({ fingerprint }) => !baselineFingerprints.has(fingerprint))
const resolvedCount = [...baselineFingerprints].filter((fingerprint) => !currentFingerprints.has(fingerprint)).length

if (newFindings.length > 0) {
  console.error(`Found ${newFindings.length} new multivendor design violation(s):`)
  newFindings.forEach((finding) => {
    console.error(`- ${finding.file}:${finding.line} [${finding.rule}] ${finding.message}`)
    console.error(`  ${finding.source}`)
  })
  process.exit(1)
}

console.log(
  `Multivendor design audit passed: ${uniqueFindings.length} legacy finding(s) remain, ${resolvedCount} resolved from baseline, 0 new.`
)
