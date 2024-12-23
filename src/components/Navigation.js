import React from 'react';
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Avatar,
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiArchive,
  FiPieChart,
  FiMenu,
  FiX,
  FiMoon,
  FiSun,
  FiUser,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavLink = ({ children, to, icon: Icon, ...rest }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const hoverBg = useColorModeValue('gray.200', 'gray.700');
  const activeBg = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Link
      as={RouterLink}
      to={to}
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: hoverBg,
      }}
      bg={isActive ? activeBg : 'transparent'}
      {...rest}
    >
      <HStack spacing={2}>
        {Icon && <Icon />}
        {children}
      </HStack>
    </Link>
  );
};

const Navigation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { currentUser, logout } = useAuth();
  const bgColor = useColorModeValue('gray.100', 'gray.900');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', to: '/', icon: FiHome },
    { name: 'Featured', to: '/featured', icon: FiTrendingUp },
    { name: 'Archive', to: '/archive', icon: FiArchive },
    { name: 'Analytics', to: '/analytics', icon: FiPieChart },
  ];

  return (
    <Box bg={bgColor} px={4} position="sticky" top={0} zIndex={1000}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <FiX /> : <FiMenu />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <Box fontWeight="bold">
            <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
              Polling App
            </Link>
          </Box>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} icon={item.icon}>
                {item.name}
              </NavLink>
            ))}
          </HStack>
        </HStack>
        <Flex alignItems={'center'}>
          <Button onClick={toggleColorMode} mr={4}>
            {colorMode === 'light' ? <FiMoon /> : <FiSun />}
          </Button>
          
          {currentUser ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Avatar
                  size={'sm'}
                  src={currentUser.photoURL}
                  name={currentUser.displayName || currentUser.email}
                />
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/profile" icon={<FiUser />}>
                  Profile
                </MenuItem>
                <MenuItem as={RouterLink} to="/settings" icon={<FiSettings />}>
                  Settings
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={handleLogout} icon={<FiLogOut />}>
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button
              as={RouterLink}
              to="/login"
              variant={'solid'}
              colorScheme={'blue'}
              size={'sm'}
              mr={4}
            >
              Sign In
            </Button>
          )}
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} icon={item.icon}>
                {item.name}
              </NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export default Navigation;
