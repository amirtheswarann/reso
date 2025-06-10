import { useColorModeValue } from "@/components/ui/color-mode"
import { Flex, IconButton, Text } from "@chakra-ui/react"
import { useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { AiOutlineClose } from "react-icons/ai"
import { ItemTypes, type DraggableInternalItem } from "../companyResearchPage"

export const DroppedItem = ({
  id,
  index,
  name,
  moveItem,
  removeItem,
}: {
  id: string
  index: number
  name: string
  moveItem: (dragIndex: number, hoverIndex: number) => void
  removeItem: (id: string) => void
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const [, drop] = useDrop<DraggableInternalItem>({
    accept: ItemTypes.COMPONENT,
    hover(item, monitor) {
      if (!ref.current || item.index === undefined) return
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) return

      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

      moveItem(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.COMPONENT,
    item: { id, index, type: ItemTypes.COMPONENT },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  const bg = useColorModeValue("white", "gray.700")
  const textColor = useColorModeValue("gray.800", "gray.200")
  const hoverBg = useColorModeValue("gray.50", "gray.600")

  return (
    <Flex
      ref={ref}
      align="center"
      justify="space-between"
      bg={bg}
      p={3}
      rounded="md"
      boxShadow="sm"
      cursor="move"
      opacity={isDragging ? 0.5 : 1}
    >
      <Text fontSize="md" color={textColor}>
        {name}
      </Text>
      <IconButton
        size="sm"
        variant="ghost"
        colorScheme="red"
        _hover={ {bg: hoverBg }}
        aria-label="Remove"
        onClick={() => removeItem(id)}
      >
        <AiOutlineClose />
      </IconButton>
    </Flex >
  )
}
