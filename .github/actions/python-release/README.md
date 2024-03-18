# dronetag/actions/release-python

Release python packages built in (standard) `dist/` directory.

**inputs:**
- `version:` version in format `X.Y[.Z][-xxxx.N]`. It will be updated in
             pyproject.toml in case it wasn't already.


## Usage

```yaml
    # Release should happen once build is done and commit tagged.
    # There is an option to have this in a separate workflow bound
    # not to the tag event (because tags created by actions don't
    # trigger) but to have this workflow as the trigger by:
    # on: {workflow_run: {workflows: ["Release"], types: completed}, workflow_dispatch: {}}
    - name: Release
      uses: dronetag/actions/release-python@main
      with:
        pypi-name: dronetag
        pypi-host: ${{ secrets.PRIV_PIP_HOST }}
        pypi-user: ${{ secrets.PRIV_PIP_USER }}
        pypi-pass: ${{ secrets.PRIV_PIP_PASSWORD }}
```
