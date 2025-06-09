import { useColorModeValue } from "@/components/ui/color-mode"
import { Text, VStack } from "@chakra-ui/react"
import type React from "react"
import { useDrop } from "react-dnd"
import { ItemTypes, type DraggableInternalItem, type DraggableNewItem } from "../companyResearchPage"
import { DroppedItem } from "./DroppedItem"
export const DroppableArea = ({
  droppedItems,
  setDroppedItems,
}: {
  droppedItems: { id: string; name: string }[]
  setDroppedItems: React.Dispatch<React.SetStateAction<{ id: string; name: string }[]>>
}) => {
  const [{ isOver, canDrop }, drop] = useDrop<
    DraggableNewItem | DraggableInternalItem,
    void,
    { isOver: boolean; canDrop: boolean }
  >(() => ({
    accept: ItemTypes.COMPONENT,
    drop: (item, monitor) => {
      if (monitor.didDrop()) return
      if ("name" in item && item.id && item.name) {
        setDroppedItems((prev) => {
          if (prev.some((d) => d.id === item.id)) return prev
          return [...prev, { id: item.id, name: item.name }]
        })
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  }), [droppedItems])


  const removeItem = (id: string) => {
    setDroppedItems((items) => items.filter((item) => item.id !== id))
  }

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    setDroppedItems((items) => {
      const updated = [...items]
      const [moved] = updated.splice(dragIndex, 1)
      updated.splice(hoverIndex, 0, moved)
      return updated
    })
  }


  const borderColor = useColorModeValue("gray.300", "gray.600")
  const activeBorderColor = useColorModeValue("teal.400", "teal.300")
  const bg = useColorModeValue("gray.50", "gray.800")
  const activeBg = useColorModeValue("teal.50", "teal.900")
  const emptyTextColor = useColorModeValue("gray.500", "gray.400")

  return (
    <VStack
      ref={drop}
      minH="200px"
      w="full"
      border="2px dashed"
      borderColor={isOver && canDrop ? activeBorderColor : borderColor}
      bg={isOver ? activeBg : bg}
      rounded="lg"
      p={4}
      gap={3}
      align="stretch"
      transition="background-color 0.2s, border-color 0.2s"
    >
      {droppedItems.length === 0 ? (
        <Text color={emptyTextColor} fontSize="sm" textAlign="center">
          Drop insights here
        </Text>
      ) : (
        droppedItems.map((item, index) => (
          <DroppedItem
            key={item.id}
            id={item.id}
            index={index}
            name={item.name}
            moveItem={moveItem}
            removeItem={removeItem}
          />
        ))
      )}
    </VStack>
  )
}