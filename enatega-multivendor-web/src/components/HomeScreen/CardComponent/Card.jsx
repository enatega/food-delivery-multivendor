import {
    Box,
    Divider,
    Typography,
    Grid,
    useTheme,
    useMediaQuery,
  } from "@mui/material";
  import { React} from "react";
import Tick from "../TickComponent/Tick";
import useStyle from "./styles";

  
  const Card = ({Icon,heading,ticksList}) => {

    let classes=useStyle()
    return (
      <Box className={classes.mainCard}>
     <Icon></Icon>
      <Typography className={classes.head}>
        {heading}
      </Typography>

      {
        ticksList.map((item)=>
        {
            return <Tick heading={item.heading} text={item.text}/>
        })
      }

      </Box>
    )
  }
  
  export default Card
  