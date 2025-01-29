import { Client, Databases } from 'appwrite';

const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66a51a3f00359e23e8ad');

const databases = new Databases(client);
export { client, databases };