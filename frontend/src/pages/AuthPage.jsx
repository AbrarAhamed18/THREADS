import { useRecoilValue } from "recoil"
import LoginCard from "../components/LoginCard"
import authScreenAtom from "../../atoms/authAtoms"
import SignupCard from "../components/SignupCard"

const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom)
    console.log(authScreenState)
  return (
    <>
        {authScreenState==="login"? <LoginCard/>: <SignupCard/>}
        
    </>
  )
}

export default AuthPage