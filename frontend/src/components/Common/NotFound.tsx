import { Button, Flex, Heading, Text, VStack } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"

const NotFound = () => {
  return (
    <Flex
      height="100vh"
      align="center"
      justify="center"
      bg="gray.50"
      p={6}
      textAlign="center"
    >
      <VStack gap={6}>
        <Heading fontSize={{ base: "6xl", md: "8xl" }}>404</Heading>
        <Text fontSize="2xl" fontWeight="medium">
          Uh oh, page not found.
        </Text>
        <Text color="gray.600" maxW="md">
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
