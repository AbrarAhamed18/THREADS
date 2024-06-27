import { Button, Flex } from "@chakra-ui/react"
import {Link} from "react-router-dom";
const HomePage = () => {
  return (
    <Link to={"/abrarahamed"}>
        <Flex w={"full"} justifyContent={"center"}>
            <Button max={"auto"}>Visit Profile Page</Button>
        </Flex>
    </Link>
  )
}

export default HomePage