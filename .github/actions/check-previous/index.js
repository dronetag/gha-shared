const core = require('@actions/core')
const github = require('@actions/github')

function fail(message) {
    if (core.getInput('fail') == 'true') {
        core.setFailed(message)
    }
    core.setOutput('found', false)
}

async function resolve_ref(token, ref) {
    const gitApi = github.getOctokit(token).rest.git

    const response = await gitApi.getRef({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        ref: ref,
    });

    const sha = response.data.object.sha
    core.info(`Resolved ${ref} to ${sha}`)

    if (!sha) {
        throw new Error(`Could not resolve ${ref}`)
    }

    return sha
}

async function list_workflows(name, token, sha) {
    const actionsApi = github.getOctokit(token).rest.actions

    const response = await actionsApi.listWorkflowRunsForRepo({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        status: 'success',
    })

    return response.data.workflow_runs.filter(
        (run) => run.head_sha == sha && run.name.startsWith(name)
    )
}

async function check(workflow_name, token, ref) {
    const ref_sha = ref ? (await resolve_ref(token, ref)) : null

    if (ref_sha) {
        core.info("Using ref sha")
    } else {
        core.info("Using context sha")
    }

    const sha = ref_sha ? ref_sha : github.context.sha
    const successful_workflows = await list_workflows(workflow_name, token, sha)
    const count = successful_workflows.length

    if (count == 0) {
        core.notice(`There were no successful ${workflow_name} runs`)
        fail(`No successful ${workflow_name} run was found`)
    } else {
        core.notice(`There are ${count} successful ${workflow_name} runs`)
        core.setOutput('found', true)
    }
}

try {
    const workflowName = core.getInput('workflow-name')
    const token = core.getInput('github-token')
    const ref = core.getInput('ref')

    core.info(`Checking for successful workflow ${workflowName}`)
    if (ref) {
        core.info(`ref set to ${ref}`)
    }

    check(workflowName, token, ref).catch(
        (error) => { core.setFailed(error.message) }
    )
} catch (error) {
    core.setFailed(error.message)
}