import React, { useState } from "react";
import {
  Box,
  Button,
  ChakraProvider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Flex,
} from "@chakra-ui/react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { useForm } from "react-hook-form";
import Loading from "../components/Loading";

function AdmimHome() {
  const { user, getAccessTokenSilently } = useAuth0();

  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", company: "ABC Inc" },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      company: "XYZ Corp",
    },
  ]);

  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [editedUserId, setEditedUserId] = useState(null);
  //   const [newUser, setNewUser] = useState({ name: "", email: "", company: "" });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    reset,
  } = useForm({});

  function onSubmit(values) {
    return new Promise((resolve) => {
      setTimeout(() => {
        handleSaveUser();
        resolve();
      }, 3000);
    });
  }

  const handleOpenNewUserModal = () => {
    setIsNewUserModalOpen(true);
  };

  const handleCloseNewUserModal = () => {
    setIsNewUserModalOpen(false);
    setEditedUserId(null);
    // setNewUser({ name: "", email: "", company: "" });
    reset();
  };

  const handleEditUser = (userId) => {
    const userToEdit = users.find((user) => user.id === userId);
    setEditedUserId(userId);
    // setNewUser({ ...userToEdit });
    setValue("name", userToEdit.name);
    setValue("email", userToEdit.email);
    setValue("company", userToEdit.company);
    setIsNewUserModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  const handleSaveUser = () => {
    const values = getValues();

    const newUser = {
      name: values.name,
      email: values.email,
      company: values.company,
    };

    if (editedUserId) {
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === editedUserId ? newUser : user))
      );
    } else {
      const newUserId = users.length + 1;
      setUsers((prevUsers) => [...prevUsers, { ...newUser, id: newUserId }]);
    }

    handleCloseNewUserModal();
  };

  return (
    <ChakraProvider>
      <Box p={4}>
        <Flex justifyContent="space-between">
          <Button colorScheme="blue" onClick={handleOpenNewUserModal} mb={4}>
            Create New User
          </Button>

          <Button
            colorScheme="blue"
            onClick={async () => {
              const token = await getAccessTokenSilently();
              const response = await fetch(
                "/.netlify/functions/listFoldersAndFiles",
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              const data = await response.json();

              alert(JSON.stringify(data));
            }}
            mb={4}
          >
            Fetch Netlify Function
          </Button>
        </Flex>

        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Company</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.company}</Td>
                <Td>
                  <Button
                    colorScheme="teal"
                    size="sm"
                    onClick={() => handleEditUser(user.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    colorScheme="red"
                    size="sm"
                    ml={2}
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Modal isOpen={isNewUserModalOpen} onClose={handleCloseNewUserModal}>
          <ModalOverlay />
          <ModalContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader>
                {editedUserId ? "Edit User" : "Create New User"}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl isInvalid={errors.name}>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Input
                    id="name"
                    placeholder="Enter name"
                    {...register("name", {
                      required: "This is required",
                      minLength: {
                        value: 4,
                        message: "Minimum length should be 4",
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.name && errors.name.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl mt={4} isInvalid={errors.email}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    {...register("email", {
                      required: "This is required",
                    })}
                  />
                  <FormErrorMessage>
                    {errors.email && errors.email.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl mt={4} isInvalid={errors.company}>
                  <FormLabel htmlFor="company">Company</FormLabel>
                  <Input
                    id="company"
                    placeholder="Enter company"
                    {...register("company", {
                      required: "This is required",
                    })}
                  />
                  <FormErrorMessage>
                    {errors.company && errors.company.message}
                  </FormErrorMessage>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Save
                </Button>
                <Button ml={2} onClick={handleCloseNewUserModal}>
                  Cancel
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  );
}

export default withAuthenticationRequired(AdmimHome, {
  onRedirecting: () => <Loading />,
});
