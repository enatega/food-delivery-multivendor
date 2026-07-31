/* eslint-disable @typescript-eslint/no-require-imports, no-console, no-undef */
const fs = require("node:fs");
const path = require("node:path");
const {
  buildClientSchema,
  getIntrospectionQuery,
  parse,
  validate,
} = require("graphql");

const DEFAULT_GRAPHQL_URL = "https://3086ptqf-8001.inc1.devtunnels.ms/graphql";
const sourceRoot = path.resolve(__dirname, "../lib/apollo");

const collectTypeScriptFiles = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectTypeScriptFiles(absolutePath);
    return entry.isFile() && entry.name.endsWith(".ts") ? [absolutePath] : [];
  });

const readDocuments = () =>
  collectTypeScriptFiles(sourceRoot).flatMap((filePath) => {
    const source = fs.readFileSync(filePath, "utf8");
    const documents = [];
    const gqlTemplate = /(\/\/\s*@multi-vendor-only\s*)?gql\s*`([\s\S]*?)`/g;
    let match;

    while ((match = gqlTemplate.exec(source)) !== null) {
      if (match[1]) continue;
      documents.push({
        filePath,
        source: match[2],
      });
    }
    return documents;
  });

const fetchSchema = async (graphqlUrl) => {
  const response = await fetch(graphqlUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: getIntrospectionQuery(),
    }),
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

const main = async () => {
  const graphqlUrl =
    process.env.SINGLE_VENDOR_GRAPHQL_URL ?? DEFAULT_GRAPHQL_URL;
  const schema = await fetchSchema(graphqlUrl);
  const documents = readDocuments();
  const failures = [];

  for (const document of documents) {
    try {
      const validationErrors = validate(schema, parse(document.source));
      for (const error of validationErrors) {
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
    `Validated ${documents.length} store GraphQL documents against ${graphqlUrl}`,
  );
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
