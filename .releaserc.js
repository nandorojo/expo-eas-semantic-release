const rules = [
  { type: "feat", release: "minor", title: "New features" },
  { type: "feature", release: "minor", title: "New features" },
  { type: "fix", release: "patch", title: "Bug fixes" },
  { type: "refactor", release: "patch", title: "Code changes" },
  { type: "chore", release: "patch", title: "Other chores" },
  { type: "docs", release: "patch", title: "Documentation changes" },
  { type: "native", release: "major" },
];
// master-prerelease

// Simple mapping to order the commit groups
const sortMap = Object.fromEntries(
  rules.map((rule, index) => [rule.title, index])
);

module.exports = {
  branches: [
    "+([0-9])?(.{+([0-9]),x}).x",
    "master",
    { name: "next", prerelease: true },
    { name: "eas", prerelease: true },
  ],
  tagFormat: "${version}",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          { revert: true, release: "patch" },
          { breaking: true, release: "major" },
        ].concat(
          rules.map(({ type, release, breaking }) => ({
            type,
            release,
            breaking,
          }))
        ),
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: rules.map(({ type, title }) => ({ type, section: title })),
        },
        writerOpts: {
          commitGroupsSort: (a, z) => sortMap[a.title] - sortMap[z.title],
        },
      },
    ],
    "@semantic-release/changelog",
    ["@semantic-release/npm", { npmPublish: false }],
    [
      "@semantic-release/git",
      {
        message:
          "chore: create new release ${nextRelease.version}\n\n${nextRelease.notes}",
        assets: ["package.json", "CHANGELOG.md"],
      },
    ],
    "@semantic-release/github",
  ],
};
