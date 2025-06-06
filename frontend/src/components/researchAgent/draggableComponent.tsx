import React, { useState, useCallback, useRef } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  VStack,
  Text,
  IconButton,
} from '@chakra-ui/react';
import { AiOutlineClose } from 'react-icons/ai';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
    COMPONENT: 'component',
  };

  const DraggableComponent = ({
    name,
    id,
    description,
  }: {
    name: string;
    id: string;
    description: string;
  }) => {
    const [, drag] = useDrag(() => ({
      type: ItemTypes.COMPONENT,
      item: { id, name, type: ItemTypes.COMPONENT },
    }));
  
    return (
      <Box
        id={id}
        ref={drag}
        p={4}
        m={2}
        bg="teal.100"
        rounded="md"
        cursor="grab"
        _hover={{ bg: 'teal.200' }}
      >
        <Text fontWeight="bold">{name}</Text>
        <Text fontSize="sm" color="gray.700">
          {description}
        </Text>
      </Box>
    );
  };
  

export default DraggableComponent;