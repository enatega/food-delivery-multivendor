const fs = require('fs')
const path = require('path')
const { parse } = require('@babel/parser')

const appRoot = path.resolve(__dirname, '..')
const moduleRoot = path.join(appRoot, 'src', 'singlevendor')
const sourceExtensions = [
  '',
  '.js',
  '.jsx',
  '.json',
  '.ios.js',
  '.android.js',
  '/index.js',
  '/index.jsx'
]

const listFiles = directory =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) return listFiles(target)
    return /\.(js|jsx)$/.test(entry.name) ? [target] : []
  })

const visit = (node, callback) => {
  if (!node || typeof node !== 'object') return
  callback(node)
  Object.values(node).forEach(value => {
    if (Array.isArray(value)) value.forEach(item => visit(item, callback))
    else if (value && typeof value === 'object' && value.type) {
      visit(value, callback)
    }
  })
}

const isResolvable = (specifier, sourceFile) => {
  if (!specifier.startsWith('.')) {
    try {
      require.resolve(specifier, { paths: [appRoot] })
      return true
    } catch {
      return false
    }
  }

  const base = path.resolve(path.dirname(sourceFile), specifier)
  return sourceExtensions.some(extension => fs.existsSync(`${base}${extension}`))
}

const failures = []
let checked = 0

listFiles(moduleRoot).forEach(sourceFile => {
  const source = fs.readFileSync(sourceFile, 'utf8')
  let ast
  try {
    ast = parse(source, {
      sourceType: 'module',
      plugins: ['jsx', 'dynamicImport']
    })
  } catch (error) {
    failures.push(`${path.relative(appRoot, sourceFile)}: parse error: ${error.message}`)
    return
  }

  visit(ast, node => {
    let specifier
    if (node.type === 'ImportDeclaration') specifier = node.source?.value
    if (
      node.type === 'CallExpression' &&
      ['require', 'import'].includes(node.callee?.name) &&
      node.arguments?.[0]?.type === 'StringLiteral'
    ) {
      specifier = node.arguments[0].value
    }
    if (!specifier) return

    checked += 1
    if (!isResolvable(specifier, sourceFile)) {
      failures.push(
        `${path.relative(appRoot, sourceFile)}:${node.loc?.start?.line || '?'} -> ${specifier}`
      )
    }
  })
})

if (failures.length) {
  console.error(`Single-vendor import check failed (${failures.length}):`)
  failures.forEach(failure => console.error(`- ${failure}`))
  process.exit(1)
}

console.log(`Single-vendor import check passed (${checked} imports checked).`)
