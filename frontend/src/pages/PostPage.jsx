import { Flex, Text, Image, Box, Divider, Button, Spinner } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import Actions from "../components/Actions";
import { useEffect } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import postsAtom from "../../atoms/postsAtom";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const[posts,setPosts] = useRecoilState(postsAtom)
  const currentPost = posts[0]

  useEffect(() => {
    setPosts([])
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        
        setPosts([data]);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };

    getPost();
  }, [showToast, pid,setPosts]);

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post Deleted", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentPost) return null;

  let createdAt;
  try {
    createdAt = new Date(post.createdAt);
    if (isNaN(createdAt)) {
      throw new Error("Invalid date");
    }
  } catch (error) {
    console.error("Invalid date format:", currentPost.createdAt);
    createdAt = null;
  }

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name="Abrar Ahamed" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}> {user.username}</Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
            {createdAt ? `${formatDistanceToNow(createdAt)} ago` : "Invalid date"}
          </Text>
          {currentUser?._id === user._id && (
            <DeleteIcon size={20} onClick={handleDeletePost} cursor={"pointer"} />
          )}
        </Flex>
      </Flex>

      <Text my={3}>{currentPost.text}</Text>

      {currentPost.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid "}
          borderColor={"gray.light"}
        >
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {currentPost.replies.map(reply=>(
        <Comment
        key={reply._id}
        reply={reply}
        lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
      />
      ))}
      
    </>
  );
};

export default PostPage;
