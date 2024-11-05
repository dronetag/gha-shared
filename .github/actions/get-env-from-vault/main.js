const fs = require('fs');
const os = require('os');

function setFailed(message) {
  process.exitCode = 1;
  process.stdout.write("::error title=Failed to get environment from Vault::" + message + os.EOL);
}

async function run() {
  try {
    // Inputs from action.yml or environment variables
    const vaultAddr = process.env[`INPUT_VAULT-ADDR`];
    const vaultToken = process.env[`INPUT_VAULT-TOKEN`];
    const secretPath = process.env[`INPUT_SECRET-PATH`];

    // Fetch secret from Vault
    const url = new URL(secretPath, vaultAddr).toString();
    const headers = { 'X-Vault-Token': vaultToken };
    const response = await fetch(url, { method: 'GET', headers });

    if (!response.ok) {
      setFailed(`Unable to fetch data from Vault. Status code: ${response.status}`);
      return;
    }

    const data = (await response.json()).data.data; // yo dawg
    if (!data) {
      setFailed('No data found at the specified path.');
      return;
    }

    // Create .env file
    const envContent = Object.entries(data)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n') + '\n';

    fs.writeFileSync('.env', envContent);
    process.stdout.write(`Created .env file with ${Object.entries(data).length} items` + os.EOL);

  } catch (error) {
    setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
