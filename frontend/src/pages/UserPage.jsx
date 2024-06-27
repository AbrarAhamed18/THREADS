import { useEffect,useState } from "react";
import UserHeader from "../components/UserHeader"
import UserPost from "../components/UsersPost"
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast"
const UserPage = () => {
  const  [user,setUser] = useState(null);
  const { username} = useParams()
  const showToast = useShowToast()
  useEffect(()=> {
    const getUser = async()=>{
      try {
        const res = await fetch(`/api/users/profile/${username}`)
        const data = await res.json()
        if(data.error){
          showToast("Error",data.error,"error")
          return
        }

        setUser(data)
      } catch (error) {
        showToast("Error",error,"error")
      }
      
    }
    getUser()
  },[username,showToast])
  if(!user) return null
  return (
    <>
    <UserHeader user={user}/>
    <UserPost likes={4512} replies={459} postImg="/post1.png" postTitle="Let's talk about threads"/>
    <UserPost likes={32} replies={4} postImg="/post2.png" postTitle="Nice Tutorial"/>
    <UserPost likes={278} replies={93} postImg="/post3.png" postTitle="Inspiration"/>
    <UserPost likes={278} replies={93}  postTitle="WE ARE HIGH"/>


    

    </>
  )
}

export default UserPage