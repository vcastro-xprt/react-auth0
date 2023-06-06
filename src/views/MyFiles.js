import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Box, IconButton } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaFile, FaFolder } from "react-icons/fa";
import Loading from "../components/Loading";

const TreeNode = ({ node }) => {
  const { getAccessTokenSilently } = useAuth0();

  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleFileClick = async () => {
    const token = await getAccessTokenSilently();
    const response = await fetch(
      `/.netlify/functions/downloadFile?fileId=${node.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const url = await response.json();

    window.open(url, "_self");
  };

  if (node.children) {
    return (
      <Box>
        <Box
          display="flex"
          alignItems="center"
          ml={2}
          p={0.5}
          cursor="pointer"
          onClick={handleToggle}
        >
          <IconButton icon={<FaFolder />} size="xs" mr={2} />
          {node.name}
        </Box>
        {expanded && (
          <Box ml={4}>
            {node.children.map((child) => (
              <TreeNode key={child.name} node={child} />
            ))}
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      ml={2}
      p={0.5}
      cursor="pointer"
      onClick={handleFileClick}
    >
      <IconButton icon={<FaFile />} size="xs" mr={2} />
      {node.name}
    </Box>
  );
};

const TreeView = () => {
  const { getAccessTokenSilently } = useAuth0();

  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const token = await getAccessTokenSilently();
      const response = await fetch("/.netlify/functions/listFoldersAndFiles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      console.log(response);

      setTreeData(data);
    };

    fetchFiles();
  }, [getAccessTokenSilently]);

  return (
    <Box height="500px">
      {treeData.map((node) => (
        <TreeNode key={node.name} node={node} />
      ))}
    </Box>
  );
};

export default withAuthenticationRequired(TreeView, {
  onRedirecting: () => <Loading />,
});
