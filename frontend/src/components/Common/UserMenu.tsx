import { useColorModeValue } from "@/components/ui/color-mode"
import {
  Box,
  Button,
  Text,
} from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"
import { FaUserAstronaut } from "react-icons/fa"
import { FiLogOut, FiUser } from "react-icons/fi"

import useAuth from "@/hooks/useAuth"
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu"

const UserMenu = () => {
  const { user, logout } = useAuth()

  const bg = useColorModeValue("white", "gray.800")
  const hoverBg = useColorModeValue("gray.100", "gray.700")
  const logoutHoverBg = useColorModeValue("red.100", "red.300")
  const textColor = useColorModeValue("gray.800", "white")

  const handleLogout = () => logout()

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          maxW="200px"
          display="flex"
          gap={2}
          alignItems="center"
          px={3}
          py={2}
          fontWeight="medium"
          _hover={{ bg: hoverBg }}
          color={textColor}
          data-testid="user-menu"
          title={user?.full_name || "User"}
        >
          <FaUserAstronaut fontSize="18px" />
          <Text lineClamp={1}>{user?.full_name || "User"}</Text>
        </Button>
      </MenuTrigger>

      <MenuContent minW="160px" bg={bg} boxShadow="md" rounded="md" p={1}>
        <Link to="settings">
          <MenuItem
            closeOnSelect
            value="user-settings"
            gap={2}
            py={2}
            cursor="pointer"
            _hover={{ bg: hoverBg }}
          >
            <FiUser fontSize="18px" />
            <Box flex="1">My Profile</Box>
          </MenuItem>
        </Link>

        <MenuItem
          value="logout"
          gap={2}
          py={2}
          cursor="pointer"
          onClick={handleLogout}
          _hover={{ bg: logoutHoverBg }}
          color="red.600"
        >
          <FiLogOut />
          Log Out
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  )
}

export default UserMenu
