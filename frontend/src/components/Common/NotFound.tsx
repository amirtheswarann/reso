import { Button, Flex, Heading, Text, VStack } from "@chakra-ui/react"
import { useColorModeValue } from "@/components/ui/color-mode"
import { Link } from "@tanstack/react-router"

const NotFound = () => {
  return (
    <Flex
      height="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue("gray.50", "gray.900")}
      p={6}
      textAlign="center"
    >
      <VStack
        gap={6}
        bg={useColorModeValue("white", "gray.800")}
        p={10}
        borderRadius="lg"
        boxShadow="lg"
      >
        <Heading fontSize={{ base: "6xl", md: "8xl" }} color={useColorModeValue("gray.800", "white")}>
          404
        </Heading>
        <Text fontSize="2xl" fontWeight="medium" color={useColorModeValue("gray.700", "gray.100")}>
          Uh oh, page not found.
        </Text>
        <Text color={useColorModeValue("gray.600", "gray.300")} maxW="md">
          The page you're looking for doesn't exist or has been moved. Check the URL or return home.
        </Text>
        <Link to="/">
          <Button colorScheme="teal" size="lg">
            Go to Dashboard
          </Button>
        </Link>
      </VStack>
    </Flex>
  )
}

export default NotFound
