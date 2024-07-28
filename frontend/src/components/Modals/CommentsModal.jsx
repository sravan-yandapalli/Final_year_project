import React, { useState } from "react";
import axios from "axios"; // Import axios
import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import Comment from "../Comment/Comment";
import usePostComment from "../../hooks/usePostComment";
import { useEffect, useRef } from "react";

const CommentsModal = ({ isOpen, onClose, post }) => {
  const { handlePostComment, isCommenting } = usePostComment();
  const commentRef = useRef(null);
  const commentsContainerRef = useRef(null);
  const [showBigPopup, setShowBigPopup] = useState(false);
  const [bigPopupContent, setBigPopupContent] = useState("");

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    await handlePostComment(post.id, commentRef.current.value);
    commentRef.current.value = "";
  };

  const handleBigPopupClick = () => {
    axios.get(`http://localhost:5000/posts/${post.id}/comments`)
      .then(response => {
        console.log(response.data.message); // Log the response from the server
        setBigPopupContent(response.data.message); // Set the content of the big popup directly
        setShowBigPopup(true); // Open the big popup
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
        // Handle error, e.g., display an error message to the user
      });
  };
  
  useEffect(() => {
    const scrollToBottom = () => {
      commentsContainerRef.current.scrollTop =
        commentsContainerRef.current.scrollHeight;
    };
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isOpen, post.comments.length]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInLeft">
        <ModalOverlay />
        <ModalContent bg={"black"} border={"1px solid gray"} maxW={"400px"}>
          <ModalHeader fontWeight={"bold"} color={"white"}>
            Comments
          </ModalHeader>
          <ModalCloseButton color={"white"} />
          <ModalBody pb={6}>
            <Flex
              mb={4}
              gap={4}
              flexDir={"column"}
              maxH={"250px"}
              overflowY={"auto"}
              ref={commentsContainerRef}
            >
              {post.comments.map((comment, idx) => (
                <Comment key={idx} comment={comment} />
              ))}
            </Flex>
            <form onSubmit={handleSubmitComment} style={{ marginTop: "2rem" }}>
              <Input placeholder="Comment" size={"sm"} ref={commentRef} />
              <Flex w={"full"} justifyContent={"flex-end"}>
                <Button
                  type="submit"
                  ml={"auto"}
                  size={"sm"}
                  my={4}
                  isLoading={isCommenting}
                >
                  Post
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Big Popup */}
      <Modal isOpen={showBigPopup} onClose={() => setShowBigPopup(false)}>
        <ModalOverlay />
        <ModalContent bg={"black"} border={"1px solid gray"} maxW={"400px"}>
          <ModalHeader fontWeight={"bold"} color={"white"}>
            Analysis Sentiment
          </ModalHeader>
          <ModalCloseButton color={"white"} />
          <ModalBody pb={6}>
            <Text color="white">{bigPopupContent}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Button for Big Popup */}
      <Button
        position="fixed"
        top="4" /* Adjust the distance from the top */
        right="4"
        size="lg"
        colorScheme="blue"
        zIndex="9999" /* Set a high z-index to ensure it's on top */
        onClick={handleBigPopupClick}
      >
        plz click here to get sentiment for the comments
      </Button>
    </>
  );
};

export default CommentsModal;
