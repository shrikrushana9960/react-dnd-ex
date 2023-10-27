import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";

const Column = ({ column, tasks,addNewTask,completeTask }) => {
  const [title, setTitle] = useState("");
  const isError = false;
  return (
    <Flex flexShrink="0" flexDir={"column"}>
      <Flex rounded="10px" bg="white" w="400px" flexDirection="column">
        <Flex
          flexShrink={"0"}
          align="center"
          h="60px"
          bg="column-header-bg"
          rounded="3px 3px 0 0"
          px="1.5rem"
          mb="1.5rem"
        >
          <Text fontSize="17px" fontWeight={600} color="subtle-text">
            {column.title}
          </Text>
        </Flex>
        <Flex
          h="520px"
          flexDir="column"
          overflow={"scroll"}
          css={{
            "&::-webkit-scrollbar": {
              width: "0px",
            },
            "&::-webkit-scrollbar-track": {
              width: "0px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(29, 29, 31,0.2)",
              borderRadius: "24px",
            },
          }}
        >
          <Droppable droppableId={column.id}>
            {(droppableProvided, droppableSnapshot) => (
              <Flex
                px="1.5rem"
                flex={1}
                flexDir="column"
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
              >
                {tasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={`${task.id}`}
                    index={index}
                  >
                    {(draggableProvided, draggableSnapshot) => (
                      <Flex
                        mb="1rem"
                        h="72px"
                        bg="card-bg"
                        rounded="10px"
                        p="1.5rem"
                        outline="2px solid"
                        outlineColor={
                          draggableSnapshot.isDragging
                            ? "card-border"
                            : "transparent"
                        }
                        boxShadow={
                          draggableSnapshot.isDragging
                            ? "0 5px 10px rgba(0, 0, 0, 0.6)"
                            : "unset"
                        }
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                      >
                      <Checkbox onChange={(e)=>{
                        if(e.target.checked){
                          completeTask(task.id,column.id) 
                        }
                      }} ></Checkbox>  <Text marginLeft={"10px"}>{task.content}</Text>
                      </Flex>
                    )}
                  </Draggable>
                ))}
              </Flex>
            )}
          </Droppable>
        </Flex>
      </Flex>{" "}
      <Flex
        flexShrink={"0"}
        flexDirection={"column"}
        padding={"10px"}
        bg="column-bg"
      >
        <Input
          type="text"
          placeholder="Task Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Button
          marginTop={"10px"}
          marginLeft={"auto"}
          type="submit"
          onClick={() => {
            if (title) {
            addNewTask(title,column.id);
              setTitle("");
              console.log("hii");
            }
          }}
          colorScheme="blue"
        >
          Add
        </Button>
      </Flex>
    </Flex>
  );
};

export default Column;
