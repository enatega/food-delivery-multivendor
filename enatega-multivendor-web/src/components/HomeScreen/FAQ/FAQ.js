import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import React from "react";
import useStyle from "./styles";

function FAQ() {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const classes = useStyle(mobile);
  return (
    <Grid container className={classes.mainContainer}>
      <Grid container item xs={12} className={classes.FAQContainer}>
        <Grid item xs={1} md={1} />
        <Grid container item xs={10} sm={10} md={9}>
          <Typography variant="h4" className={classes.FAQTitle}>
            Order food online from the best restaurants and shops on Enatega
          </Typography>
          <Typography variant="subtitle1" className={classes.FAQAns}>
            Are you hungry? Had a long and busy day? Then Enatega is the right place for you! Enatega, offers you a long
            and detailed <b>list of the best restaurants near you</b>. Whether it is a delicious Pizza, Burger, Japanese
            or any kind of Fast Food you are craving, Enatega has an extensive roaster restaurants available for you to{" "}
            <b>order food online with home delivery</b>.
          </Typography>
          <Typography variant="h4" className={classes.FAQTitle}>
            What's new?
          </Typography>
          <Grid item xs={12}>
            <List disablePadding>
              <ListItem alignItems="flex-start" disableGutters style={{ padding: "0px" }}>
                <ListItemIcon>
                  <DoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Selection of premium restaurants, all kind of cuisines." />
              </ListItem>
              <ListItem alignItems="flex-start" disableGutters style={{ padding: "0px" }}>
                <ListItemIcon>
                  <DoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="High quality delivery service." />
              </ListItem>
              <ListItem alignItems="flex-start" disableGutters style={{ padding: "0px" }}>
                <ListItemIcon>
                  <DoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Live chat feature to give App users instant help when they need it." />
              </ListItem>
              <ListItem divider alignItems="flex-start" disableGutters style={{ padding: "0px", marginBottom: "10px" }}>
                <ListItemIcon>
                  <DoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="NEW: Enatega grocery delivery! Discover the best shops, pharmacies, bakeries and more near you." />
              </ListItem>
            </List>
          </Grid>
          <Typography variant="h5" className={classes.FAQTitle} style={{ marginBottom: "20px" }}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="h6" className={classes.FAQTitle}>
            How can I get enatega delivery?
          </Typography>
          <Typography variant="subtitle1" className={classes.FAQAns}>
            To get enatega delivery, simply locate the restaurants near you by typing in your address, browse through a
            variety of restaurants and cuisines, check menus and prices, choose your dishes and add them to the basket.
            Now you only need to checkout and make the payment. Soon your delicious food will arrive at your doorstep!
          </Typography>
          <Typography variant="h6" className={classes.FAQTitle}>
            How can I order food?
          </Typography>
          <Typography variant="subtitle1" className={classes.FAQAns}>
            To order food delivery, follow these simple steps:
            <p style={{ paddingLeft: "50px" }}>
              <b>Find a restaurant.</b> Enter your delivery address in the location form to see all the places that
              deliver to your location. It can be your home, office, a hotel or even parks! <br />
              <b>Choose your dishes.</b> Browse the menu of the chosen restaurant, select your dishes and add them to
              your basket. When you are done, press the "Checkout" button. <br />
              <b>Checkout & Payment.</b> Check your order, payment method selection and exact delivery address. Simply
              follow the checkout instructions from there. <br />
              <b>Delivery.</b> We will send you an email and SMS confirming your order and delivery time. Sit back,
              relax and wait for piping hot food to be conveniently delivered to you!. <br />
            </p>
          </Typography>
          <Typography variant="h6" className={classes.FAQTitle}>
            Does enatega deliver 24 hours?
          </Typography>
          <Typography variant="subtitle1" className={classes.FAQAns}>
            Yes, enatega in Pakistan delivers 24 hours. However, many restaurants may be unavailable for a late night
            delivery. Please check which places in Pakistan deliver to you 24 hours by using your address.
          </Typography>
          <Typography variant="h6" className={classes.FAQTitle}>
            Can you pay cash for enatega?
          </Typography>
          <Typography variant="subtitle1" className={classes.FAQAns}>
            Yes, you can pay cash on delivery for enatega in Pakistan.
          </Typography>
          <Typography variant="h6" className={classes.FAQTitle}>
            How can I pay enatega online?
          </Typography>
          <Typography variant="subtitle1" className={classes.FAQAns}>
            You can pay online while ordering at enatega Pakistan by using a credit or debit card or PayPal.
          </Typography>
          <Typography variant="h6" className={classes.FAQTitle}>
            Can I order enatega for someone else?
          </Typography>
          <Typography variant="subtitle1" className={classes.FAQAns}>
            Yes, enatega Pakistan allows you to place an order for someone else. During checkout, just update the name
            and delivery address of the person you're ordering for. Please keep in mind that if the delivery details are
            not correct and the order cannot be delivered, we won't be able to process a refund.
          </Typography>
          <Typography variant="h6" className={classes.FAQTitle}>
            How much does enatega charge for delivery?
          </Typography>
          <Typography variant="subtitle1" className={classes.FAQAns}>
            Delivery fee charged by enatega in Pakistan depends on many operational factors, most of all - location and
            a restaurant you are ordering from. You can always check the delivery fee while forming your order. Besides,
            you can filter the restaurants by clicking on "Free Delivery" icon on the top of your restaurants listing.
          </Typography>
          <Typography variant="h6" className={classes.FAQTitle}>
            What restaurants let you order online?
          </Typography>
          <Typography variant="subtitle1" className={classes.FAQAns}>
            There are hundreds of restaurants on enatega Pakistan that let you order online. For example, KFC,
            McDonald's, Pizza Hut, OPTP, Hardee's, Domino's, Kababjees and many-many more! In order to check all the
            restaurants near you that deliver, just type in your address and discover all the available places.
          </Typography>
          <Typography variant="h6" className={classes.FAQTitle}>
            What restaurants let you order online?
          </Typography>
          <Typography variant="subtitle1" className={classes.FAQAns}>
            There are hundreds of restaurants on enatega Pakistan that let you order online. For example, KFC,
            McDonald's, Pizza Hut, OPTP, Hardee's, Domino's, Kababjees and many-many more! In order to check all the
            restaurants near you that deliver, just type in your address and discover all the available places.
          </Typography>
          <Typography variant="h6" className={classes.FAQTitle}>
            Does enatega have minimum order?
          </Typography>
          <Typography variant="subtitle1" className={classes.FAQAns}>
            Yes, many restaurants have a minimum order. The minimum order value depends on the restaurant you order from
            and is indicated during your ordering process.
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default React.memo(FAQ);
