import { VStack, Text, Box } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { DraggableNewItem, DraggableInternalItem, ItemTypes } from './companyResearchPage';
import { DroppedItem } from './DroppedItem';

export const DroppableArea = ({
  droppedItems, setDroppedItems,
}: {
  droppedItems: { id: string; name: string; }[];
  setDroppedItems: React.Dispatch<React.SetStateAction<{ id: string; name: string; }[]>>;
}) => {
  const [{ isOver, canDrop }, drop] = useDrop<
  DraggableNewItem | DraggableInternalItem,
  void,
  { isOver: boolean; canDrop: boolean }
>(() => ({
  accept: ItemTypes.COMPONENT,
  drop: (item, monitor) => {
    const didDropOnChild = monitor.didDrop();
    if (didDropOnChild) return;

    if ('name' in item && item.id && item.name) {
      setDroppedItems((prev) => {
        if (prev.some((d) => d.id === item.id)) return prev;
        return [...prev, { id: item.id, name: item.name }];
      });
    }
  },
  collect: (monitor) => ({
    isOver: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
  }),
}), [droppedItems]);


  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    setDroppedItems((prevItems) => {
      const updated = [...prevItems];
      const [removed] = updated.splice(dragIndex, 1);
      updated.splice(hoverIndex, 0, removed);
      return updated;
    });
  }, [setDroppedItems]);

  const removeItem = (id: string) => {
    setDroppedItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <VStack
      ref={drop}
      p={4}
      mt={4}
      minH="200px"
      border="2px dashed"
      borderColor={isOver && canDrop ? 'green.400' : 'gray.300'}
      bg={isOver ? 'green.50' : 'white'}
      rounded="md"
      gap={2}
      align="stretch"
    >
      {droppedItems.length === 0 ? (
        <Text color="gray.500" textAlign="center">
          Drop components here
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
  );
};
