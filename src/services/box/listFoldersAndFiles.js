const { adminClient } = require("../../infra/box");

const listFoldersAndFiles = async (
  folderId,
  tree = { name: "root", id: "", type: "", children: [] }
) => {
  try {
    const items = await adminClient.folders.getItems(folderId);

    for (const item of items.entries) {
      if (item.type === "folder") {
        const folderNode = {
          name: item.name,
          id: item.id,
          type: item.type,
          children: [],
        };

        tree.children.push(folderNode);

        await listFoldersAndFiles(item.id, folderNode);
      } else if (item.type === "file") {
        tree.children.push({ name: item.name, id: item.id, type: item.type });
      }
    }

    return tree;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  listFoldersAndFiles,
};
