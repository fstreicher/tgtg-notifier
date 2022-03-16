import * as fs from 'fs';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { GlobalOptions } from 'googleapis/build/src/apis/abusiveexperiencereport';
import * as readline from 'readline';

interface Secret {
  client_id: string;
  project_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_secret: string;
  javascript_origins: Array<string>;
}

const SCOPES = ['https://www.googleapis.com/auth/gmail.modify'];
const TOKEN_PATH = 'token.json';
const TGTG_LABEL = 'Label_6250840274030950651';

export async function getLoginPin(): Promise<string> {
  // Load client secrets from a local file.
  const secretRaw = fs.readFileSync('client_secret.json');
  const secret = JSON.parse(secretRaw.toString()) as unknown as { web: Secret };
  // Authorize a client with credentials, then call the Gmail API.
  const oAuthClient = await authorize(secret);
  return getPinFromMail(oAuthClient);
}

/**
 * Create an OAuth2 client with the given credentials
 * @param credentials The authorization client credentials.
 */
function authorize(credentials: { web: Secret }): Promise<OAuth2Client> {
  const { client_secret, client_id } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, 'http://localhost');

  // Check if we have previously stored a token.
  const tokenRaw = fs.existsSync(TOKEN_PATH) ? fs.readFileSync(TOKEN_PATH) : null;

  if (!tokenRaw) {
    return getNewToken(oAuth2Client);
  }

  const token = JSON.parse(tokenRaw.toString()) as Credentials;
  oAuth2Client.setCredentials(token);
  return Promise.resolve(oAuth2Client);
}

/**
 * Get and store new token after prompting for user authorization
 * @param oAuth2Client The OAuth2 client to get token for.
 */
async function getNewToken(oAuth2Client: OAuth2Client): Promise<OAuth2Client> {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const codeFromInput = await new Promise<string>((resolve, reject) => {
    rl.question('Enter the code from that page here: ', (code) => resolve(code));
  });
  rl.close();

  const token = await oAuth2Client.getToken(codeFromInput);
  oAuth2Client.setCredentials(token.tokens);
  // Store the token to disk for later program executions
  fs.writeFile(TOKEN_PATH, JSON.stringify(token.tokens), (err) => {
    if (err) return console.error(err);
    console.log('Token stored to', TOKEN_PATH);
  });

  return oAuth2Client;
}

/**
 * Lists the labels in the user's account.
 *
 * @param auth An authorized OAuth2 client.
 */
async function getPinFromMail(auth: OAuth2Client): Promise<string> {
  const gmail = google.gmail({ version: 'v1', auth });

  return gmail.users.messages.list({ maxResults: 1, userId: 'me', labelIds: [TGTG_LABEL], q: 'is:unread' })
    .then(res => {
      const message = res?.data.messages?.[0];
      if (!message) {
        console.debug('no email found [1]');
        return Promise.reject();
      }

      return gmail.users.messages.get({ id: message.id!, userId: 'me' })
        .then(res => {
          const numberRegex = /\d{6}/g;
          const data = res?.data;
          let pin = data.snippet?.match(numberRegex)?.pop();
          if (pin) {
            gmail.users.messages.trash({ id: message.id!, userId: 'me' });
            return pin;
          }

          const mailBody = res?.data.payload?.body?.data;
          if (mailBody) {
            console.debug('found email, getting pin');
            const mailHTML = Buffer.from(mailBody, 'base64').toString();
            const pinRegex = />(\d{6})</g;
            const pin = mailHTML.match(pinRegex)?.pop();
            gmail.users.messages.trash({ id: message.id!, userId: 'me' });
            return pin?.match(numberRegex)?.pop() ?? '';
          }
          console.debug('no email found [2]');
          return '';
        });

    })
    .catch(err => {
      console.error(err);
      return '';
    });
}