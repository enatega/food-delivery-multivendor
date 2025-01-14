import { Typography } from "@mui/material";
import { React,useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from '@mui/icons-material/Remove';
import useStyle from "./styles";

const FaqAccordian = ({ heading, summary }) => {
  let classes = useStyle();
  const [expanded, setExpanded] = useState(false);

  const handleChange = () => {
    setExpanded(!expanded);
  };
  return (
    <Accordion className={classes.accord} expanded={expanded} onChange={handleChange}>
      <AccordionSummary
        className={classes.accordSummary}
        expandIcon={expanded ? <RemoveIcon /> : <AddIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography style={{ color: "black" }}>{heading}</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordDetails}>
        <Typography style={{ color: "black" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default FaqAccordian;
