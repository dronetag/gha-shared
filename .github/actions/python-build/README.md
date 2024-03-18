# dronetag/actions/build-python

**build-python** action uses `python -m build` and expects standard pyproject.toml (no poetry).

It replaces `version = "X.Y.Z"` if it is written in the pyproject.toml in this standard format

```toml
[project]
name = "your-package"
version = "1.0.0"
```

and leaves the change for you to (for example) commit it later. For that, see
the action [commit-and-tag](../commit-and-tag/) with `git-add` and `commit` settings.

## Usage

```yaml
    # Build action makes sure the version is correct in the meta-file
    # hence there are changed files if the version wasn't there already
    - name: Build package
      uses: dronetag/actions/build-python@main
      with:
        version: ${{ steps.semantic.outputs.version }}
```
