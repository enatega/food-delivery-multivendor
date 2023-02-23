import { Paper, Typography, IconButton } from "@mui/material";
import React, { useEffect } from "react";
import { TextInput } from "./TextInput.js";
import { MessageLeft, MessageRight } from "./Message";
import CloseIcon from "@mui/icons-material/Close";
import { useChatScreen } from "../../hooks/useChat";
import moment from "moment";
import useStyles from "./styles.js";
import { Box } from "@mui/system";

export default function Chat({ setToggleChat, id }) {
  const { messages, onSend, profile, messageContainerRef } = useChatScreen(id);
  const classes = useStyles();
  useEffect(()=>{
    messageContainerRef.current.focus()
  })
  return (
    <div className={classes.container}>
      <Paper className={classes.paper}>
        <Box className={classes.header}>
          <IconButton
            onClick={() => setToggleChat(false)}
            className={classes.closeBtn}
          >
            <CloseIcon style={{ color: "white", fontSize: "30px" }} />
          </IconButton>

          <Typography variant="body2" className={classes.heading}>
            Let's start chat with your rider
          </Typography>
        </Box>
        {/* How to focus on new message */}
        {/* https://stackoverflow.com/questions/55118437/react-auto-scroll-to-bottom-on-a-chat-container */}
        <Paper id="style-1" className={classes.messagesBody} elevation={0} ref={messageContainerRef}>
          {messages ? (
            messages.map((msg) => {
              return profile._id === msg.user._id ? (
                <MessageRight
                  key={msg._id}
                  message={msg.text}
                  timestamp={moment(msg.createdAt).format("LT")}
                  displayName={msg.user.name}
                  avatarDisp={true}
                />
              ) : (
                <MessageLeft
                  key={msg._id}
                  message={msg.text}
                  timestamp={moment(msg.createdAt).format("LT")}
                  displayName={msg.user.name}
                  avatarDisp={true}
                />
              );
            })
          ) : (
            <Typography align="center">Lets Chat with rider</Typography>
          )}
        </Paper>
        <TextInput sendMessage={onSend} onKeyDown={onSend}/>
      </Paper>
    </div>
  );
}
