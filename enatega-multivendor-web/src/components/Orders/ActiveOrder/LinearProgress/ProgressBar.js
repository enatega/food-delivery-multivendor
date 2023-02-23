/* eslint-disable react-hooks/exhaustive-deps */
import { Box, useTheme, LinearProgress, useMediaQuery } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import useStyles from "./styles";

function ProgressBar(props) {
  const [progress, setProgress] = useState(0);
  const theme = useTheme();
  const extraSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles(extraSmall);
  let timer = useRef(null);
  useEffect(() => {
    timer.current = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        const abc = Math.min(oldProgress + diff, 100);
        return abc;
      });
    }, 2500);

    return () => {
      clearInterval(timer.current);
    };
  }, []);

  return (
    <Box display={"flex"}>
      <LinearProgress
        variant="determinate"
        value={progress}
        className={[classes.linearProgress, classes.margin, classes.bar]}
      />
      <LinearProgress
        variant="determinate"
        value={progress}
        className={[classes.linearProgress, classes.margin, classes.bar]}
      />
      <LinearProgress
        variant="determinate"
        value={progress}
        className={[classes.linearProgress, classes.margin, classes.bar]}
      />
      <LinearProgress
        variant="determinate"
        value={progress}
        className={[classes.linearProgress, classes.margin, classes.bar]}
      />
    </Box>
  );
}

export default React.memo(ProgressBar);
