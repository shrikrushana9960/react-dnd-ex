import { Button, Flex, Input, InputGroup, InputRightElement, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { constants } from "../constants/contants";
import Head from "next/head";
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err,seterr]=useState();
  const [show, setShow] = React.useState(false);
  const router=useRouter()
  const handleClick = () => setShow(!show);

  const login = async () => {
    try{
    const res = await axios.get(
      constants.URL + `/users/getUserByEmail/${email}/${password}`
    );
    if (res.data.success) {
   

      if(res.data.data.user.length>0){
        localStorage.setItem("user",JSON.stringify(res.data.data.user[0]))
        seterr()
        
        router.push("/")
      }
      else{
        seterr("Login details are wrong. try again")
      }
    }}
    catch(e){
        console.log(e)
        seterr()
    }
  };
  const register = async () => {
    try{
        const data={
            email,
            password
        }
    const res = await axios.post(
      constants.URL + `/users/addUser`,data
    );
    if (res.data.success) {
      console.log(res.data.data);
     
        localStorage.setItem("user",JSON.stringify(res.data.data))
        seterr()
        router.push("/")

    }}
    catch(e){
        console.log(e)
        seterr("Try again with different email")
    }
  };
  return (
    <Flex
      flexDir="column"
      bg="main-bg"
      minH="100vh"
      w="full"
      color="white-text"
      pb="2rem"
      alignItems={"center"}
      justifyContent={"center"}
    >
        <Head><title>Login</title></Head>
      <Flex
        flexDirection={"column"}
        width="350px"
        rounded="10px"
        padding={"20px"}
      >
        <Text
          fontSize="20px"
          marginBottom={"20px"}
          marginLeft={"auto"}
          marginRight={"auto"}
          fontWeight={600}
          color="subtle-text"
        >
          Login In Task List
        </Text>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputGroup size="md"  marginTop={"10px"}>
          <Input
            pr="4.5rem"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" color={"blue"} size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Flex
       
      >
        <Button
          marginTop={"10px"}
          marginLeft={"auto"}
          marginRight={"5px"}
          type="submit"
          onClick={login}
          flex={1}
          
          colorScheme="blue"
        >
          Login
        </Button>

        <Button
          marginTop={"10px"}
          marginLeft={"5px"}
          flex={1}
          marginRight={"auto"}
          type="submit"
          onClick={register}
          colorScheme="blue"
        >
          Register
        </Button></Flex>
       {err&& <Text
          fontSize="16px"
          marginTop={"20px"}
          marginLeft={"auto"}
          marginRight={"auto"}
          fontWeight={600}
          color="red"
        >
          {err}
        </Text>}
      </Flex>
    </Flex>
  );
};

export default Login;
