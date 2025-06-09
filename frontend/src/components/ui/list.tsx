import { Box, List, Text } from "@chakra-ui/react"

export function renderList(items?: string[]) {
    if (!items || items.length === 0) {
        return <Text color="gray.500">No data available.</Text>
    }

    return (
        <Box pl={4} mt={2}>
            <List.Root gap={2} mt={2}>
                {items.map((item, idx) => (
                    <List.Item key={idx}>
                        {item}
                    </List.Item>
                ))}
            </List.Root>
        </Box>
    )
}
