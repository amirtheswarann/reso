import { useColorModeValue } from "@/components/ui/color-mode"
import {
  Box,
  Flex,
  IconButton,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { FaBars } from "react-icons/fa"
import { FiLogOut } from "react-icons/fi"

import type { UserPublic } from "@/client"
import useAuth from "@/hooks/useAuth"
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerRoot,
  DrawerTrigger,
} from "../ui/drawer"
import HistoryItems from "./HistoryItems"

const Sidebar = () => {
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)

  const bg = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.700")
  const displaySidebarDesktop = useBreakpointValue({ base: "none", md: "flex" })

  return (
    <>
      {/* Mobile Drawer */}
      <DrawerRoot
        placement="start"
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
      >
        <DrawerBackdrop />
        <DrawerTrigger asChild>
          <IconButton
            variant="ghost"
            color="inherit"
            display={{ base: "flex", md: "none" }}
            aria-label="Open Menu"
            position="fixed"
            zIndex="overlay"
            m={4}
            size="lg"
          >
            <FaBars />
          </IconButton>
        </DrawerTrigger>
        <DrawerContent
          maxW="xs"
          bg={bg}
          borderRight="1px"
          borderColor={borderColor}
          pt={4}
          pb={6}
        >
          <DrawerCloseTrigger />
          <DrawerBody>
            <Flex flexDir="column" justify="space-between" h="full">
              <Box>
                <HistoryItems onClose={() => setOpen(false)} />
                {currentUser?.email && (
                  <Text
                    fontSize="sm"
                    p={3}
                    mt={4}
                    borderTop="1px"
                    borderColor={borderColor}
                    lineHeight={1}
                  >
                    Logged in as: {currentUser.email}
                  </Text>
                )}
                <Flex
                  as="button"
                  onClick={logout}
                  alignItems="center"
                  gap={3}
                  px={4}
                  py={3}
                  mt={4}
                  rounded="md"
                  cursor="pointer"
                  color="red.600"
                  _hover={{ bg: "red.50" }}
                >
                  <FiLogOut size="20px" />
                  <Text fontWeight="medium">Log Out</Text>
                </Flex>
              </Box>
            </Flex>
          </DrawerBody>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>

      {/* Desktop Sidebar */}
      <Box
        display={displaySidebarDesktop}
        position="sticky"
        top={0}
        bg={bg}
        borderRight="1px"
        borderColor={borderColor}
        minW="64"
        h="100vh"
        boxShadow="sm"
      >
        <Flex direction="column" h="full">
          <Box flex="1" overflowY="auto" p={6}>
            <HistoryItems />
          </Box>
          <Box borderTop="1px" p={4}>
          </Box>
        </Flex>
      </Box>
    </>
  )
}

export default Sidebar
