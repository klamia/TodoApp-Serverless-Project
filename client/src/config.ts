// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '3kfmo5a9va'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-019ro45e.us.auth0.com',            // Auth0 domain
  clientId: 'QquMm1JgxGz0gPPFNH1r3zixUop7aTFM',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
