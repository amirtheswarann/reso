import { List, Text } from "@chakra-ui/react"

export function renderList(items?: string[]) {
  if (!items || items.length === 0) return <Text>Unable to find data.</Text>
  return (
    <List.Root gap={2}>
      {items.map((item, idx) => (
        <List.Item key={idx}>{item}</List.Item>
      ))}
    </List.Root>
  )
}
