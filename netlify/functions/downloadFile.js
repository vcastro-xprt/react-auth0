const { wrap } = require("@netlify/integrations");
const { withAuth0 } = require("@netlify/auth0");

const { downloadFile } = require("../../src/services/box/downloadFile");

const withIntegrations = wrap(withAuth0);

exports.handler = withIntegrations(
  async (event, context) => {
    const fileId = event.queryStringParameters.fileId;

    const data = await downloadFile(fileId);

    return {
      statusCode: 200,
      body: data,
    };
  },
  {
    auth0: {
      required: true,
      // roles: ["admin"],
    },
  }
);
