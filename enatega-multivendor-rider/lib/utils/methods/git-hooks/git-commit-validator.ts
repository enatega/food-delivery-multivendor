// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require("child_process");

const commitMsg = execSync("cat .git/COMMIT_EDITMSG").toString().trim();
const pattern =
  /^(\w+) - (build|fix|refactor|revert|pull|style|test|translation|security|changeset|config) - (.+) - (v\d+(\.\d+)*)$/;

if (!pattern.test(commitMsg)) {
  console.log("Invalid commit type or format.");
  console.log(
    "Format should be: branch - subject (must be from [build|fix|refactor|revert|pull|style|test|translation|security|changeset|config]) - description - version",
  );
  process.exit(1);
}
const [, , , version] =
  commitMsg ?
    (commitMsg.match(pattern)?.slice(1) ?? ["", "", "", ""])
  : ["", "", "", ""];

// Get the last commit messageå
let lastCommitMsg: string | undefined;
try {
  lastCommitMsg = execSync("git log -1 --pretty=%B").toString().trim();
} catch (error) {
  console.log("Failed to get last commit message");
  process.exit(1);
}

if (lastCommitMsg) {
  const lastCommitMatch = lastCommitMsg.match(pattern);

  if (lastCommitMatch) {
    const [, , , lastVersion] = lastCommitMatch.slice(1);

    /*   if (description === lastDescription) {
      console.log('Description must be different from the previous commit.');
      process.exit(1);
    } */

    if (version === lastVersion) {
      console.log("Version must be different from the previous commit.");
      process.exit(1);
    }
  }
}

process.exit(0);
