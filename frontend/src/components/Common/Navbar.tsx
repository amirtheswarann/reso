import { useColorModeValue } from "@/components/ui/color-mode"
import { Logo } from "@/components/ui/logo"
import {
  Flex,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"
import UserMenu from "./UserMenu"

function Navbar() {
  const display = useBreakpointValue({ base: "none", md: "flex" })

  const bg = useColorModeValue("white", "gray.900")
  const borderColor = useColorModeValue("gray.200", "gray.700")

  return (
    <Flex
      display={display}
      justify="space-between"
      position="sticky"
      top={0}
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
      align="center"
      px={{ base: 4, md: 8 }}
      py={3}
      zIndex={10}
      boxShadow="sm"
    >
      <Link to="/">
        <Image src={Logo()} alt="Logo" maxW="120px" />
      </Link>
      <Flex align="center" gap={4}>
        <UserMenu />
      </Flex>
    </Flex>
  )
}

export default Navbar
