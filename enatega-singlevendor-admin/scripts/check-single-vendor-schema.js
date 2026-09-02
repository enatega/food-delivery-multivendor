/* eslint-disable @typescript-eslint/no-require-imports, no-console */
const fs = require('node:fs');
const path = require('node:path');
const {buildClientSchema, parse, validate} = require('graphql');

const sourceRoot = path.resolve(__dirname, '../lib/api/graphql');

const sourceFiles = directory =>
  fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(absolute);
    return entry.isFile() && /\.(ts|tsx)$/.test(entry.name) ? [absolute] : [];
  });

const documents = () => sourceFiles(sourceRoot).flatMap(filePath => {
  const source = fs.readFileSync(filePath, 'utf8');
  const matches = [];
  const template = /gql\s*`([\s\S]*?)`/g;
  let match;
  while ((match = template.exec(source)) !== null) {
    if (!match[1].includes('@client')) matches.push({filePath, source: match[1]});
  }
  return matches;
});

const loadLocalSchema = modulePath => {
  const absolute = path.resolve(modulePath);
  const typeDefs = require(absolute);
  const serverGraphql = require(
    path.resolve(path.dirname(absolute), '../../node_modules/graphql')
  );
  const schema = serverGraphql.buildASTSchema(typeDefs);
  const result = serverGraphql.graphqlSync({
    schema,
    source: serverGraphql.getIntrospectionQuery(),
  });
  return buildClientSchema(result.data);
};

const main = () => {
  if (!process.env.SINGLE_VENDOR_SCHEMA_MODULE) {
    throw new Error('SINGLE_VENDOR_SCHEMA_MODULE is required');
  }
  const schema = loadLocalSchema(process.env.SINGLE_VENDOR_SCHEMA_MODULE);
  const failures = documents().flatMap(document => {
    try {
      return validate(schema, parse(document.source)).map(
        error => `${path.relative(process.cwd(), document.filePath)}: ${error.message}`
      );
    } catch (error) {
      return [`${path.relative(process.cwd(), document.filePath)}: ${error.message}`];
    }
  });
  if (failures.length) throw new Error(failures.join('\n'));
  console.log(`Single-vendor admin schema check passed (${documents().length} documents checked).`);
};

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
