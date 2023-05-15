import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useContext } from "react";
import ConfigurationContext from "../../../context/Configuration";
import useStyles from "./styles";

function ItemCard(props) {
  const theme = useTheme();
  const { title, foods } = props;
  const classes = useStyles();
  const configuration = useContext(ConfigurationContext);
  return (
    <Container className={classes.cardContainer}>
      <Typography
        variant="h5"
        color="textSecondary"
        className={`${classes.titleText} ${classes.boldText}`}
      >
        {title}
      </Typography>
      <Grid container spacing={2}>
        {foods.map((item, index) => (
          <Grid key={index} item xs={12} md={6}>
            <Paper
              elevation={1}
              square
              className={classes.itemContainer}
              onClick={() => props.onPress({ ...item, ...props.restaurant })}
            >
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    className={classes.boldText}
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="caption" className={classes.itemDesc}>
                    {item.description}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {`${configuration.currencySymbol} ${parseFloat(
                    item.variations[0].price
                  ).toFixed(2)}`}
                  {item.variations[0].discounted > 0 && (
                    <Typography
                      variant="caption"
                      className={classes.discountText}
                    >
                      {`${configuration.currencySymbol} ${parseFloat(
                        item.variations[0].price + item.variations[0].discounted
                      ).toFixed(2)}`}
                    </Typography>
                  )}
                </Typography>
              </Box>
              <Box
                className={classes.imageContainer}
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <Button className={classes.addContainer}>
                  <AddIcon style={{ color: theme.palette.common.white }} />
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default React.memo(ItemCard);
