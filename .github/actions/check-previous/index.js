const core = require('@actions/core')
const github = require('@actions/github')

function fail(message) {
    if (core.getInput('fail') == 'true') {
        core.setFailed(message)
    }
    core.setOutput('found', false)
}

async function list_workflows(name, token) {
    const actionsApi = github.getOctokit(token).rest.actions
    
    const response = await actionsApi.listWorkflowRunsForRepo({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        status: 'success',
    })

    return response.data.workflow_runs.filter(
        (run) => run.head_sha == github.context.sha && run.name.startsWith(name)
    )
}

async function check(workflow_name, token) {
    const successful_workflows = await list_workflows(workflow_name, token)
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
    
    check(workflowName, token).catch(
        (error) => { core.setFailed(error.message) }
    )
} catch (error) {
    core.setFailed(error.message)
}