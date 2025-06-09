import { useColorModeValue } from "@/components/ui/color-mode"
import { Box, Text } from "@chakra-ui/react"
import { useDrag } from "react-dnd"
import { ItemTypes } from "../companyResearchPage"

const DraggableComponent = ({
  id,
  name,
  description,
}: {
  id: string
  name: string
  description: string
}) => {
  const bg = useColorModeValue("white", "gray.700")
  const hoverBg = useColorModeValue("gray.50", "gray.600")
  const borderColor = useColorModeValue("gray.200", "gray.600")
  const textColor = useColorModeValue("gray.600", "gray.300")

  const [, drag] = useDrag(() => ({
    type: ItemTypes.COMPONENT,
    item: { id, name, type: ItemTypes.COMPONENT },
  }))

  return (
    <Box
      ref={drag}
      p={4}
      bg={bg}
      border="1px solid"
      borderColor={borderColor}
      rounded="lg"
      boxShadow="sm"
      cursor="grab"
      _hover={{ boxShadow: "md", bg: hoverBg }}
    >
      <Text fontWeight="semibold" fontSize="md" mb={1}>
        {name}
      </Text>
      <Text fontSize="sm" color={textColor}>
        {description}
      </Text>
    </Box>
  )
}

export default DraggableComponent
