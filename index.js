const path = require("path")
const process = require("process")
const { authenticate } = require("@google-cloud/local-auth")
const { google } = require("googleapis")
// The scope for reading contacts.
const SCOPES = ['https://www.googleapis.com/auth/contacts.readonly'];
// The path to the credentials file.
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Prints the display names of the first 10 connections.
 */
async function listConnectionNames() {
  // Authenticate with Google and get an authorized client.
  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  // Create a new People API client.
  const service = google.people({version: 'v1', auth});
  // Get the list of connections.
  const result = await service.people.connections.list({
    resourceName: 'people/me',
    pageSize: 10,
    personFields: 'names,emailAddresses',
  });
  const connections = result.data.connections;
  if (!connections || connections.length === 0) {
    console.log('No connections found.');
    return;
  }
  console.log('Connections:');
  // Print the display name of each connection.
  connections.forEach((person) => {
    if (person.names && person.names.length > 0) {
      console.log(person.names[0].displayName);
    } else {
      console.log('No display name found for connection.');
    }
  });
}

listConnectionNames();