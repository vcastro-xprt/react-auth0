const { wrap } = require("@netlify/integrations");
const { withAuth0 } = require("@netlify/auth0");

const {
  listFoldersAndFiles,
} = require("../../src/services/box/listFoldersAndFiles");

const withIntegrations = wrap(withAuth0);

exports.handler = withIntegrations(
  async (event, context) => {
    const rootFolderId = "0";

    const data = await listFoldersAndFiles(rootFolderId);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  },
  {
    auth0: {
      required: true,
      // roles: ["admin"],
    },
  }
);
