import { Box, Typography, Grid } from "@mui/material";
import { React } from "react";
import FaqAccordian from "./FaqAccordian";
import useStyle from "./styles";

const Faq = () => {
  let faq = [
    { heading: "What is Enatega and how does it work?", summary: "" },
    { heading: "How do I join Enatega?", summary: "" },
    { heading: "What tools does Enatega offer for vendors?", summary: "" },
    { heading: "How do riders get paid?", summary: "" },
    { heading: "Can customers track their orders?", summary: "" },
    { heading: "What payment options are available?", summary: "" },
    { heading: "Is Enatega available in my area?", summary: "" },
  ];

  let classes = useStyle();
  return (
    <Grid className={classes.mainBox} container md={10} xs={11}>
      <Box className={classes.box}>
        <Typography className={classes.mainText}>
          Frequently asked questions
        </Typography>
      </Box>

      <Box className={classes.box}>
        {faq.map((item) => {
          return (
            <FaqAccordian
              key={item.heading}
              heading={item.heading}
              summary={item.summary}
            />
          );
        })}
      </Box>
    </Grid>
  );
};

export default Faq;
