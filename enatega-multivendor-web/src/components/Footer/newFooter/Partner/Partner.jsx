import {
    Box,
    Divider,
    Typography,
    Grid,
    useTheme,
    useMediaQuery,
    Button
  } from "@mui/material";

  import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import React from 'react'

const Partner = () => {
  return (
    <Box>
        <Typography 
        
        variant="h5"
        style={{color:"white",display:"flex"
        }}
        sx={{
             
            justifyContent:{
                xs:"center",
                md:"left"
              }
            }}
        
        >
         Partner with us
        </Typography>
        
        <Box
        style={{
            display:"flex",
            flexDirection:"column",
        }}
        sx={{
             
            justifyContent:{
                xs:"center",
                md:"left"
              }
            }}
        >
        <Button variant="contained" style={{backgroundColor:"#5AC12F", width:"200px",color:"black"  }}
        sx={{
            margin:{
                xs:"10px auto",
                md:"10px 0 5px 0"
            }

        }}
        
        >Become a Vendor 

  <ArrowForwardIosIcon style={{width:"24px",height:"24px",color:"black" }}/>
        </Button>
        <Button variant="contained"  style={{backgroundColor:"#5AC12F", marginBottom:10,width:"200px", color:"black" }}
        sx={{
            margin:{
                xs:"10px auto",
                md:"5px 0 5px 0"
            }

        }}
        
        >Become a Driver

            <ArrowForwardIosIcon
            style={{width:"24px",height:"24px",color:"black" }}
            />
        </Button>
        </Box>




    </Box>
  )
}

export default Partner
