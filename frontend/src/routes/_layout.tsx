import { useColorModeValue } from "@/components/ui/color-mode"
import { Flex } from "@chakra-ui/react"
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

import Navbar from "@/components/Common/Navbar"
import Sidebar from "@/components/Common/Sidebar"
import { isLoggedIn } from "@/hooks/useAuth"

export const Route = createFileRoute("/_layout")({
  component: Layout,
  beforeLoad: async () => {
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      })
    }
  },
})

function Layout() {
  const bg = useColorModeValue("gray.50", "gray.900")

  return (
    <Flex direction="column" h="100vh" bg={bg}>
      <Navbar />
      <Flex flex="1" overflow="hidden">
        <Sidebar />
        <Flex
          flex="1"
          direction="column"
          p={{ base: 3, md: 6 }}
          overflowY="auto"
          bg={useColorModeValue("white", "gray.900")}
          roundedLeft={{ base: 0, md: "md" }}
          boxShadow={{ base: "none", md: "md" }}
        >
          <Outlet />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Layout
