const fs = require('fs');
const core = require('@actions/core');

async function run() {
  try {
    // Inputs from action.yml or environment variables
    const vaultAddr = core.getInput('vault-addr');
    const vaultToken = core.getInput('vault-token');
    const secretPath = core.getInput('secret-path');

    // Fetch secret from Vault
    const url = new URL(vaultAddr, secretPath).toString();
    const headers = { 'X-Vault-Token': vaultToken };
    const response = await fetch(url, { method: 'GET', headers });

    if (!response.ok) {
      core.setFailed(`Error: Unable to fetch data from Vault. Status code: ${response.status}`);
      return;
    }

    const data = (await response.json()).data.data; // yo dawg
    if (!data) {
      core.setFailed('Error: No data found at the specified path.');
      return;
    }

    // Create .env file
    const envContent = Object.entries(data)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n') + '\n';

    fs.writeFileSync('.env', envContent);
    core.info(`Created .env file with ${Object.entries(data).length} items`);

  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
