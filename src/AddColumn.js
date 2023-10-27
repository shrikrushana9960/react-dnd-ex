import { Button, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { Input } from '@chakra-ui/react'
const AddColumn = ({ addColumn }) => {
    const [title,setTitle]=useState('');
    const isError = title === ''
  return (
    <Flex
      rounded="3px"
      bg="column-bg"
      w="400px"
      flexShrink="0"
    //   h="620px"
      flexDir="column"
    >
           
      <Flex
        align="center"
        h="60px"
        bg="column-header-bg"
        rounded="3px 3px 0 0"
        px="1.5rem"
        mb="1.5rem"
      >
        <Text fontSize="17px" fontWeight={600} color="white-text">
          Add Column
        </Text>
      </Flex>
      
      <FormControl padding={"10px"} isInvalid={isError}>
      <FormLabel>Title</FormLabel>
        <Input type="text" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)}/>
        {!isError ? (
        <FormHelperText>
          Enter title of Column
        </FormHelperText>
      ) : (
        <FormErrorMessage>Title is required.</FormErrorMessage>
      )}
        <Button marginTop={"10px"}   type='submit' onClick={()=>{
            if(title){
            addColumn(title);
            setTitle('')
            console.log("hii")}
            
        }}  colorScheme='blue'>Add</Button>
      </FormControl>
   
    </Flex>
  );
};

export default AddColumn;
