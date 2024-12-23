import React from 'react';
import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
  Container,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  IconButton,
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiMoon, FiSun, FiPlus } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import CreatePollModal from './CreatePollModal';

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <Box
      bg={navBg}
      px={4}
      position="sticky"
      top={0}
      zIndex="sticky"
      borderBottom="1px"
      borderColor={borderColor}
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <RouterLink to="/">
            <Text
              fontSize="xl"
              fontWeight="bold"
              bgGradient="linear(to-r, brand.500, brand.800)"
              bgClip="text"
            >
              VoteSphere
            </Text>
          </RouterLink>

          <Flex alignItems="center">
            <Stack direction="row" spacing={4} align="center">
              <IconButton
                icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
                onClick={toggleColorMode}
                variant="ghost"
                aria-label="Toggle color mode"
              />

              {currentUser ? (
                <>
                  <Button
                    leftIcon={<FiPlus />}
                    colorScheme="brand"
                    onClick={onOpen}
                  >
                    Create Poll
                  </Button>

                  <Menu>
                    <MenuButton>
                      <Avatar
                        size="sm"
                        name={currentUser.email}
                        src={currentUser.photoURL}
                      />
                    </MenuButton>
                    <MenuList>
                      <MenuItem as={RouterLink} to="/dashboard">
                        Dashboard
                      </MenuItem>
                      <MenuItem as={RouterLink} to="/profile">
                        Profile
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </MenuList>
                  </Menu>
                </>
              ) : (
                <HStack spacing={4}>
                  <Button
                    as={RouterLink}
                    to="/login"
                    variant="ghost"
                  >
                    Login
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/signup"
                    colorScheme="brand"
                  >
                    Sign Up
                  </Button>
                </HStack>
              )}
            </Stack>
          </Flex>
        </Flex>
      </Container>

      <CreatePollModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
