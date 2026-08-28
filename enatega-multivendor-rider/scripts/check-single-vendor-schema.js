/* eslint-disable @typescript-eslint/no-require-imports, no-console, no-undef */
const fs = require("node:fs");
const path = require("node:path");
const {
  buildClientSchema,
  getIntrospectionQuery,
  parse,
  validate,
} = require("graphql");

const DEFAULT_GRAPHQL_URL =
  "https://enatega-multivendor-api-production-9b09.up.railway.app/graphql";
const sourceRoots = [
  path.resolve(__dirname, "../lib/api"),
  path.resolve(__dirname, "../lib/apollo"),
];

const collectSourceFiles = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(absolutePath);
    return entry.isFile() && /\.(ts|tsx)$/.test(entry.name)
      ? [absolutePath]
      : [];
  });

const readDocuments = () =>
  sourceRoots.flatMap((sourceRoot) =>
    collectSourceFiles(sourceRoot).flatMap((filePath) => {
      const source = fs.readFileSync(filePath, "utf8");
      const documents = [];
      const gqlTemplate = /(\/\/\s*@multi-vendor-only\s*)?gql\s*`([\s\S]*?)`/g;
      let match;

      while ((match = gqlTemplate.exec(source)) !== null) {
        if (match[1]) continue;
        documents.push({ filePath, source: match[2] });
      }
      return documents;
    }),
  );

const fetchSchema = async (graphqlUrl) => {
  const response = await fetch(graphqlUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query: getIntrospectionQuery() }),
  });

  if (!response.ok) {
    throw new Error(`Schema request failed with HTTP ${response.status}`);
  }

  const payload = await response.json();
  if (payload.errors?.length || !payload.data) {
    throw new Error(
      payload.errors?.map((error) => error.message).join("\n") ||
        "Schema response did not include data",
    );
  }
  return buildClientSchema(payload.data);
};

const loadLocalSchema = (modulePath) => {
  const absoluteModulePath = path.resolve(modulePath);
  const typeDefs = require(absoluteModulePath);
  const serverGraphql = require(
    path.resolve(path.dirname(absoluteModulePath), "../../node_modules/graphql"),
  );
  const serverSchema = serverGraphql.buildASTSchema(typeDefs);
  const introspection = serverGraphql.graphqlSync({
    schema: serverSchema,
    source: serverGraphql.getIntrospectionQuery(),
  });
  return buildClientSchema(introspection.data);
};

const main = async () => {
  const graphqlUrl =
    process.env.SINGLE_VENDOR_GRAPHQL_URL ?? DEFAULT_GRAPHQL_URL;
  const schema = process.env.SINGLE_VENDOR_SCHEMA_MODULE
    ? loadLocalSchema(process.env.SINGLE_VENDOR_SCHEMA_MODULE)
    : await fetchSchema(graphqlUrl);
  const documents = readDocuments();
  const failures = [];

  for (const document of documents) {
    try {
      for (const error of validate(schema, parse(document.source))) {
        failures.push(
          `${path.relative(process.cwd(), document.filePath)}: ${error.message}`,
        );
      }
    } catch (error) {
      failures.push(
        `${path.relative(process.cwd(), document.filePath)}: ${error.message}`,
      );
    }
  }

  if (failures.length) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
    return;
  }

  console.log(
    `Validated ${documents.length} rider GraphQL documents against ${process.env.SINGLE_VENDOR_SCHEMA_MODULE ? 'the local single-vendor schema' : graphqlUrl}`,
  );
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
