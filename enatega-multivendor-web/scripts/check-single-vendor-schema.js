const fs = require("fs");
const path = require("path");
const { parse: parseJavaScript } = require("@babel/parser");
const { buildClientSchema, getIntrospectionQuery, parse, validate } = require("graphql");

const appRoot = path.resolve(__dirname, "..");
const sourceFile = path.join(appRoot, "lib/api/graphql/single-vendor/index.ts");
const endpoint = process.env.SINGLE_VENDOR_SCHEMA_URL || "https://enatega-multivendor-api-production-9b09.up.railway.app/graphql";
const visit = (node, callback) => { if (!node || typeof node !== "object") return; callback(node); Object.values(node).forEach((value) => { if (Array.isArray(value)) value.forEach((item) => visit(item, callback)); else if (value && typeof value === "object") visit(value, callback); }); };
const documents = [];
const ast = parseJavaScript(fs.readFileSync(sourceFile, "utf8"), { sourceType: "module", plugins: ["typescript"] });
visit(ast, (node) => { if (node.type === "TaggedTemplateExpression" && node.tag?.name === "gql" && node.quasi?.expressions?.length === 0) documents.push({ line: node.loc?.start?.line || 1, value: node.quasi.quasis[0].value.cooked }); });

async function main() {
  let schema;
  if (process.env.SINGLE_VENDOR_SCHEMA_MODULE) {
    const modulePath = path.resolve(process.env.SINGLE_VENDOR_SCHEMA_MODULE);
    const typeDefs = require(modulePath);
    const serverGraphql = require(path.resolve(path.dirname(modulePath), "../../node_modules/graphql"));
    const serverSchema = serverGraphql.buildASTSchema(typeDefs);
    const introspection = serverGraphql.graphqlSync({ schema: serverSchema, source: serverGraphql.getIntrospectionQuery() });
    schema = buildClientSchema(introspection.data);
  } else {
    const response = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query: getIntrospectionQuery() }) });
    const result = await response.json();
    schema = buildClientSchema(result.data);
  }
  const failures = documents.flatMap((document) => validate(schema, parse(document.value)).map((error) => `${sourceFile}:${document.line}: ${error.message}`));
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`Single-vendor web schema check passed (${documents.length} documents checked).`);
}
main().catch((error) => { console.error(error.message); process.exit(1); });
