import { Box, Button, Spinner, Text, VStack } from "@chakra-ui/react"

const LoadingOverlay = ({
  status,
  onCancel,
}: {
  status: string
  onCancel: () => void
}) => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={9999}
      bg="rgba(0, 0, 0, 0.75)"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack gap={6}>
        <Spinner size="xl" color="white" />
        <Text color="white" fontSize="lg" textAlign="center">
          {status}
        </Text>
        <Button colorScheme="red" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </VStack>
    </Box>
  )
}

export default LoadingOverlay
