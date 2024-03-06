# dronetag/gha-shared/.github/actions/commit-and-tag

Commit (optional) and tag the current commit. This action has a few self-regulations.

- it creates a commit only if current HEAD is the tip of the default branch
- it commits only if there are changes present in the repository
- it creates a tag only if the tag does not exist yet (not a failure)

**inputs:**
- `version` version in format `X.Y[.Z][-xxxx.N]` that will be used as the tag vVERSION and in commit message
- `git-add` files separated with space that will be added to the commit
- `commit` whether a commit will be created before tagging (only if on the tip of the default branch)

## Usage
 If you manage release modifications such as version updating and changelog modification yourself:
```yaml
    - name: Commit and tag
      if: ${{ steps.semantic.outputs.existed == 'false' }}
      uses: dronetag/gha-shared/.github/actions/commit-and-tag@main
      with:
        version: ${{ steps.semantic.outputs.version }}
        tag-message: ${{ steps.semantic.outputs.changelog }}
        commit: false
        github-token: ${{ github.token }}
```

If you want to have everything done automagically then
```yaml
    # Changelog was constructed in some of previous steps
    # most likely dronetag/action/semantic-release was run
    # with: changelog: true (which is the default so far)
    - name: Commit and tag
      if: ${{ steps.semantic.outputs.existed == 'false' }}
      uses: dronetag/gha-shared/.github/actions/commit-and-tag@main
      with:
        version: ${{ steps.semantic.outputs.version }}
        tag-message: ${{ steps.semantic.outputs.changelog }}
        git-add: changelog.md
        commit: true
        github-token: ${{ github.token }}
```
