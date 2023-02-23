import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { TextField } from "@mui/material";
import useStyles from "./styles";

export const TextInput = ({ sendMessage, onKeyDown }) => {
  const classes = useStyles();
  const [inputMessage, setInputMessage] = useState("");

  return (
    <>
      <form className={classes.wrapForm} noValidate autoComplete="off">
        <TextField
          id="standard-text"
          label="Send message"
          className={classes.wrapText}
          multiline
          inputProps={{ className: classes.input }}
          onKeyDown={(e) => {
            e.key === "Enter" && !e.shiftKey && e.preventDefault();
            if(e.key === "Enter" && !e.shiftKey){
              onKeyDown(inputMessage)
              setInputMessage("")
            }
          }}
          value={inputMessage}
          onChange={(event) => setInputMessage(event.target.value)}
          InputProps={{
            endAdornment: (
              <SendIcon
                color="primary"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  sendMessage(inputMessage)
                  setInputMessage("")
                }}
              />
            ),
          }}
        />
      </form>
    </>
  );
};
