import { readFile, writeFile } from 'fs';
import { createInterface } from 'readline';
import { google } from 'googleapis';

const SCOPES = ['https://mail.google.com/', 'https://www.googleapis.com/auth/gmail.send', ];

const TOKEN_PATH = './config/token.json';

export function start(to, email_message, title) {
    readFile('./config/credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err); // Authorize a client with credentials, then call the Gmail API.
        authorize(to, email_message, title, JSON.parse(content), sendMail);
    });
}


function authorize(to, email_message, title, credentials, callback) {
	const {
		client_secret,
		client_id,
		redirect_uris
	} = credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]); // Check if we have previously stored a token.
	readFile(TOKEN_PATH, (err, token) => {
		if (err) return getNewToken(oAuth2Client, callback);
		oAuth2Client.setCredentials(JSON.parse(token));
		callback(oAuth2Client, to, email_message, title);
	});
}

function getNewToken(oAuth2Client, callback) {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});
	console.log('Authorize this app by visiting this url:', authUrl);
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	rl.question('Enter the code from that page here: ', (code) => {
		rl.close();
		oAuth2Client.getToken(code, (err, token) => {
			if (err) return console.error('Error retrieving access token', err);
			oAuth2Client.setCredentials(token);
			writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
				if (err) return console.error(err);
				console.log('Token stored to', TOKEN_PATH);
			});
			callback(oAuth2Client);
		});
	});
}

function sendMail(auth, to, email_message, title) {
	const gmail = google.gmail({
		version: 'v1',
		auth
	});
	gmail.users.messages.send({
		userId: 'me',
		requestBody: {
			raw: base64Encode('From: casper.cwnu.bot@gmail.com\n' + `To: ${to}\n` + `Subject: ${title}\n` + 'MIME-Version: 1.0\n' + 'Content-Type: text/html; charset="UTF-8"\n' + 'Content-Transfer-Encoding: message/rfc2822\n' + '\n' + `${email_message}\n`),
		},
	}, (err, res) => {
		if (err) return console.log('The API returned an error: ' + err);
		const messageId = res.data.id;
		console.log(`Message sent with ID: ${messageId}`);
	});
}

const base64Encode = (message) => {
	return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
};