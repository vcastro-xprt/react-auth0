const { adminClient } = require("../../infra/box");

const downloadFile = async (fileId = "0") => {
  try {
    const url = await adminClient.files.getDownloadURL(fileId);

    return url;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  downloadFile,
};
