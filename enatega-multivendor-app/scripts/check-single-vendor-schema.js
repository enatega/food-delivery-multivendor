const fs = require('fs')
const path = require('path')
const { parse: parseJavaScript } = require('@babel/parser')
const {
  buildClientSchema,
  getIntrospectionQuery,
  parse,
  validate
} = require('graphql')

const appRoot = path.resolve(__dirname, '..')
const graphQlFiles = [
  'src/singlevendor/apollo/queries.js',
  'src/singlevendor/apollo/mutations.js',
  'src/singlevendor/apollo/subscriptions.js'
]
const endpoint =
  process.env.SINGLE_VENDOR_SCHEMA_URL ||
  'https://enatega-multivendor-api-production-9b09.up.railway.app/graphql'

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

const documents = []

graphQlFiles.forEach(relativeFile => {
  const source = fs.readFileSync(path.join(appRoot, relativeFile), 'utf8')
  const ast = parseJavaScript(source, { sourceType: 'module' })

  visit(ast, node => {
    let value
    if (
      node.type === 'TaggedTemplateExpression' &&
      node.tag?.name === 'gql' &&
      node.quasi?.expressions?.length === 0
    ) {
      value = node.quasi.quasis[0]?.value?.cooked
    }
    if (
      node.type === 'VariableDeclarator' &&
      node.init?.type === 'TemplateLiteral' &&
      node.init.expressions.length === 0 &&
      /^\s*subscription\b/.test(node.init.quasis[0]?.value?.cooked || '')
    ) {
      value = node.init.quasis[0].value.cooked
    }
    if (!value) return

    documents.push({
      file: relativeFile,
      line: node.loc?.start?.line || 1,
      value
    })
  })
})

const main = async() => {
  let schema
  if (process.env.SINGLE_VENDOR_SCHEMA_MODULE) {
    const schemaModule = path.resolve(process.env.SINGLE_VENDOR_SCHEMA_MODULE)
    const resolvedSchemaModule = require.resolve(schemaModule)
    const serverTypeDefs = require(resolvedSchemaModule)
    // Workspaces may install separate GraphQL module instances. Build and
    // introspect with the server's own instance, then consume the plain result.
    const serverGraphql = require(path.resolve(
      path.dirname(resolvedSchemaModule),
      '..',
      '..',
      'node_modules',
      'graphql'
    ))
    const serverSchema = serverTypeDefs.kind === 'Document'
      ? serverGraphql.buildASTSchema(serverTypeDefs)
      : serverTypeDefs
    const result = serverGraphql.graphqlSync({
      schema: serverSchema,
      source: serverGraphql.getIntrospectionQuery()
    })
    if (result.errors?.length) {
      throw new Error(result.errors.map(error => error.message).join('\n'))
    }
    schema = buildClientSchema(result.data)
  } else {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: getIntrospectionQuery() })
    })
    if (!response.ok) {
      throw new Error(`Schema request failed with HTTP ${response.status}`)
    }

    const result = await response.json()
    if (result.errors?.length) {
      throw new Error(result.errors.map(error => error.message).join('\n'))
    }
    schema = buildClientSchema(result.data)
  }
  const failures = []

  documents.forEach(document => {
    let parsed
    try {
      parsed = parse(document.value)
    } catch (error) {
      failures.push(`${document.file}:${document.line}: ${error.message}`)
      return
    }
    validate(schema, parsed).forEach(error => {
      failures.push(`${document.file}:${document.line}: ${error.message}`)
    })
  })

  if (failures.length) {
    console.error(`Single-vendor schema check failed (${failures.length}):`)
    failures.forEach(failure => console.error(`- ${failure}`))
    process.exit(1)
  }

  console.log(
    `Single-vendor schema check passed (${documents.length} documents checked).`
  )
}

main().catch(error => {
  console.error(`Single-vendor schema check could not run: ${error.message}`)
  process.exit(1)
})
