import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { CardActionArea } from '@mui/material'

export default function RestaurantCard(props) {
  return (
    <Card
      style={{
        boxShadow: '0px 0px 23px rgba(0, 0, 0, 0.1)',
        borderRadius: 25
      }}
      sx={{ maxWidth: 250, height: 300 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="120"
          sx={{ opacity: 0.6 }}
          image={props.rest.image}
          alt="Restaurant Image"
        />
        <CardMedia
          component="img"
          alt="round img"
          image={props.rest.image}
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            mt: -3,
            ml: 2,
            border: '7px solid #fafafa',
            position: 'relative',
            zIndex: 999
          }}
        />
        <CardContent>
          <Typography
            color="#000"
            sx={{ textDecoration: 'none' }}
            variant="h6"
            bold
            component="div">
            {props.rest.name}
          </Typography>
          <Typography
            sx={{ textDecoration: 'none' }}
            variant="caption"
            color="text.secondary">
            {props.rest.address}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
