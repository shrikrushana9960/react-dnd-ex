import { Button, Flex, HStack, Heading, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import AddColumn from "../src/AddColumn";
import axios from "axios";
import { constants } from "../constants/contants";
import { useRouter } from "next/router";

const Column = dynamic(() => import("../src/Column"), { ssr: false });

const reorderColumnList = (sourceCol, startIndex, endIndex) => {
  const newTaskIds = Array.from(sourceCol.taskIds);
  const [removed] = newTaskIds.splice(startIndex, 1);
  newTaskIds.splice(endIndex, 0, removed);

  const newColumn = {
    ...sourceCol,
    taskIds: newTaskIds,
  };

  return newColumn;
};

function getNextId(columns) {
  let highestId = 0;
  for (const columnId in columns) {
    const idNumber = parseInt(columnId.split("-")[1]);
    if (idNumber > highestId) {
      highestId = idNumber;
    }
  }
  return highestId + 1;
}

export default function ToDoList() {
  const [state, setState] = useState({
    tasks: {},
    columns: {},
    columnOrder: [],
  });
  const [tasks, setTasks] = useState([]);
  const [column, setColumn] = useState([]);
  const [columnOrder, setColumnOrder] = useState([]);
  const router = useRouter();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const onDragEnd = async (result) => {
    const { destination, source } = result;
    console.log({ destination, source });
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceCol = state.columns[source.droppableId];
    const destinationCol = state.columns[destination.droppableId];

    if (sourceCol.id === destinationCol.id) {
      const newColumn = reorderColumnList(
        sourceCol,
        source.index,
        destination.index
      );

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };

      setState(newState);
      return;
    }

    const startTaskIds = Array.from(sourceCol.taskIds);
    const [removed] = startTaskIds.splice(source.index, 1);
    const newStartCol = {
      ...sourceCol,
      taskIds: startTaskIds,
    };

    const endTaskIds = Array.from(destinationCol.taskIds);
    endTaskIds.splice(destination.index, 0, removed);
    const newEndCol = {
      ...destinationCol,
      taskIds: endTaskIds,
    };

    console.log({ endTaskIds });
    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      },
    };

    setState(newState);
    const data = {
      id: sourceCol.taskIds[source.index],
      column_id: destination.droppableId,
    };

    const res = await axios.put(constants.URL + "/tasks/updateTasksById", data);
    if (res.data.success) {
      let data = res.data;
      console.log({ data: res.data });
    }
  };
  const addNewColumn = async (title) => {
    const nextId = getNextId(state.columns);
    const newId = `column-${nextId}`;

    const data = {
      title,
      user_id: user.userId,
    };
    const newColumn = {
      id: newId,
      title: title,
      taskIds: [],
    };

    const res = await axios.post(constants.URL + "/task_column/add", data);
    if (res.data.success) {
      let data = res.data.data;
      data.taskIds = [];
      data.id = data.column_id;
      newColumn = data;
    }

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newColumn.id]: newColumn,
      },
      columnOrder: [...state.columnOrder, newColumn.id],
    };
    setColumnOrder([...state.columnOrder, newColumn.id]);
    setState(newState);
  };

  useEffect(() => {
    let data = localStorage.getItem("user");
try{
    if (data) {
      setUser(JSON.parse(data));
    }
    else{
      router.push("/login")
    }}
    catch(e){
      router.push("/login") 
    }
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(true);
      console.log(user.userId);
      getTaskColumn(user.userId);
      setLoading(false);
    }
  }, [user]);
  useEffect(() => {
    if (columnOrder && user) getTask(user.userId);
  }, [columnOrder, user]);
  const addNewTask = async (title, columnId) => {
    const nextId = Object.keys(state.tasks).length + 1;
    const newId = nextId;

    const data = {
      content: title,
      user_id: user.userId,
      column_id: columnId,
      status:"ongoing"
    };

    const newTask = {
      id: newId,
      content: title,
    };
    const res = await axios.post(constants.URL + "/tasks/add", data);
    if (res.data.success) {
      let data = res.data.data;
      newTask = data;
    }

    const newState = {
      ...state,
      tasks: {
        ...state.tasks,
        [newTask.id]: newTask,
      },
    };
    newState.columns[columnId].taskIds = [
      ...state.columns[columnId].taskIds,
      newTask.id,
    ];
    setState(newState);
  };
  const getTask = async (user_id) => {
    try {
      const res = await axios.get(
        constants.URL + "/tasks/getTasksUserId/" + user_id
      );
      if (res.data.success) {
        let data = {};
        let columns = res.data?.data?.tasks;
        columns.map((item) => {
          data[item.id] = item;
        });
        let newState = {
          ...state,
          tasks: data,
        };

        state?.columnOrder?.map((item) => {
          newState.columns[item].taskIds = columns
            .filter((value) => value.column_id == item)
            .map((data) => data.id);
        });

        setState(newState);
        setTasks(res.data?.data?.tasks);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getTaskColumn = async (user_id) => {
    try {
      const res = await axios.get(
        constants.URL + "/task_column/getTaskColumnByUserId/" + user_id
      );
      if (res.data.success) {
        let data = {};
        let columns = res.data?.data?.taskColumn.map((item) => ({
          ...item,
          id: item.column_id,
          taskIds: [],
        }));
        columns.map((item) => {
          data[item.column_id] = item;
        });
        console.log({ data });
        setState({
          ...state,
          columns: data,
          columnOrder: columns.map((item) => item.column_id),
        });
        setColumnOrder(columns.map((item) => item.column_id));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const completeTask = async(id, column_id) => {
    const newState = { ...state };
    console.log(
      newState.columns[column_id].taskIds.filter((item) => item != id)
    );
    newState.columns[column_id].taskIds = newState.columns[
      column_id
    ].taskIds.filter((item) => item != id);
    const data = {
      id: id,
      status:"completed"
    };

    const res = await axios.put(constants.URL + "/tasks/updateTasksById", data);
    if (res.data.success) {
      let data = res.data;
      console.log({ data: res.data });
    }
    setState(newState);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Flex
        flexDir="column"
        bg="main-bg"
        minH="100vh"
        w="full"
        color="white-text"
        pb="2rem"
      >
        <Flex py="4rem" flexDir="row" align="center">
          <Heading fontSize="3xl" fontWeight={600} marginLeft={"10px"}>
            Welcome {user?.email}
          </Heading>
          {loading && (
            <Heading fontSize="10px" color={"red"} fontWeight={600}>
              Loading ...
            </Heading>
          )}
          <Button
            colorScheme="blue"
            margin="10px"
            marginLeft={"auto"}
            onClick={() => {
              localStorage.removeItem("user");
              router.push("/login");
            }}
          >
            Logout
          </Button>
        </Flex>

        <HStack
          spacing={4}
          overflowX="auto"
          css={{
            margin: 10,
            paddingBottom: 20,
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-track": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(29, 29, 31,0.2)",
              borderRadius: "24px",
            },
            alignItems: "flex-start",
          }}
        >
          {state?.columnOrder?.map((columnId) => {
            const column = state.columns[columnId];
            const tasks = column.taskIds?.map((taskId) => state.tasks[taskId]);

            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks}
                addNewTask={addNewTask}
                completeTask={completeTask}
              />
            );
          })}
          <AddColumn addColumn={addNewColumn} />
        </HStack>
      </Flex>
    </DragDropContext>
  );
}
