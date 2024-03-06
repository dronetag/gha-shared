## dronetag/gha-shared/.github/actions/semantic-release

This action runs the semantic-release tool in dry-mode and returns
current or the next available version. Hence the behaviour is influenced
by your `.releaserc` file.

This action requires that the repository was cloned by
```yaml
    - name: Checkout repository (full-depth)
      uses: actions/checkout@v4
      with: { fetch-depth: 0 } # Required to determine version
```

The recommended content of `.releaserc` is following:
```json
{
	"branches": [
		{ "name": "main" },
		{ "name": "[a-z]+/([a-zA-Z0-9\\-]+)", "prerelease": "${name.replace(/^.*\\//g, '')}"}
	],
	"plugins": [
		[
			"@semantic-release/commit-analyzer",
			{
				"releaseRules": [
					{ "type": "refactor", "release": "patch"},
					{ "type": "perf", "release": "patch" }
				]
			}
		],
		"@semantic-release/release-notes-generator"
	]
}
```
It has `main` branch as the production and all `[fix/feature/...]/<description>`
branches will be pre-release branches.

You will get current version if you run this action on a commit that
has a tag on it. It also sets `outputs.existed='true'`.

If the new version is a pre-release, it will be incremented until it
finds a version that does not exist as a tag in the repository. Hence
pre-release versions will always return a version but on production
branches the action fails if the version already exists as a tag.

If you have _"@semantic-release/release-notes-generator"_ in your .releaserc
and allow changelog generator via `inputs.changelog=true` then a changelog.md
and changelog{version}.md will be available in the repository to your disposition.
The changelog will also be uploaded as an artifact under name `changelog{version}`.
Nevertheless, the changelog will be returned in `outputs.changelog` whether you
specify `inputs.changelog=true` or not.


**inputs:**
- `github_token`: required only if project's .releaserc uses github plugin
- `changelog`: whether to produce changelog.md, changelog{version}.md and an artifact

**outputs:**
- `version`: the next version in format `X.Y.Z[-pre-release.N]`
- `changelog`: the changelog in markdown format
- `prerelease`: true if the next version is a pre-release
- `existed`: true if the version already existed as a tag on current commit


## Example usage

```yaml
    - name: Get next release version
      uses: dronetag/gha-shared/.github/actions/semantic-release@master
      id: semantic
      with:
        changelog: false
```
