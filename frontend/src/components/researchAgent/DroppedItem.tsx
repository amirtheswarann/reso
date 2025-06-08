import { Flex, IconButton, Text } from "@chakra-ui/react"
import React, { useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { AiOutlineClose } from "react-icons/ai"
import { type DraggableInternalItem, ItemTypes } from "./companyResearchPage"

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
      if (!ref.current) return

      if (item.index === undefined) return

      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) return

      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
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

  return (
    <Flex
      ref={ref}
      p={3}
      bg="gray.100"
      rounded="md"
      align="center"
      justify="space-between"
      w="full"
      cursor="move"
      opacity={isDragging ? 0.5 : 1}
    >
      <Text>{name}</Text>
      <IconButton
        aria-label="Remove"
        as={AiOutlineClose}
        size="sm"
        onClick={() => removeItem(id)}
      />
    </Flex>
  )
}
