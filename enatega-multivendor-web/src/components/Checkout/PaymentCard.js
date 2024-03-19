import {
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Radio,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useContext } from "react";
import { ReactComponent as CodIcon } from "../../assets/icons/bill_cash.svg";
import { ReactComponent as MastercardIcon } from "../../assets/icons/master_card.svg";
import { ReactComponent as PayPalIcon } from "../../assets/icons/paypal_icon.svg";
import { ReactComponent as VisaIcon } from "../../assets/icons/visa_icon.svg";
import { ReactComponent as Payment } from "../../assets/icons/payment_method.svg";
import useStyles from "./styles";
import UserContext from "../../context/User";
import ConfigurationContext from "../../context/Configuration";
import { useTranslation } from "react-i18next";

/*const PAYMENT_OPTIONS = [
  {
    id: 0,
    payment: "STRIPE",
    label: "Credit / Debit Card",
    icon: <VisaIcon />,
    icon1: <MastercardIcon />,
  },
  {
    id: 1,
    payment: "PAYPAL",
    label: "Paypal",
    icon: <PayPalIcon />,
  },
  {
    id: 2,
    payment: "COD",
    label: "Cash",
    icon: <CodIcon />,
  },
];*/

function PaymentCard({
  paymentMethod,
  setPaymentMethod,
  validateOrder,
  onPayment,
  loading,
  calculateTotal,
}) {
  const { t } = useTranslation();
  const PAYMENT_OPTIONS = [
    {
      id: 0,
      payment: "STRIPE",
      label: t("creditDebitCard"),
      icon: <VisaIcon />,
      icon1: <MastercardIcon />,
    },
    {
      id: 1,
      payment: "PAYPAL",
      label: t("paypal"),
      icon: <PayPalIcon />,
    },
    {
      id: 2,
      payment: "COD",
      label: t("cash"),
      icon: <CodIcon />,
    },
  ];
  const theme = useTheme();
  const classes = useStyles();
  const { cart } = useContext(UserContext);
  const configuration = useContext(ConfigurationContext);

  return (
    <>
      <Paper
        style={{
          background: theme.palette.common.white,
          paddingBottom: theme.spacing(2),
          paddingTop: theme.spacing(2),
          marginTop: theme.spacing(4),
          boxShadow: "0px 0px 5px 1px rgba(0,0,0,0.2)",
          borderRadius: 20,
        }}
      >
        <Container>
          <Box>
            <Box display="flex" alignItems="center">
              <Payment style={{ paddingTop: 5 }} />
              <Box ml={theme.spacing(1)} />
              <Typography
                variant="body2"
                color="textSecondary"
                fontWeight={800}
              >
                {t("paymentMethod")}
              </Typography>
            </Box>
            <Divider
              orientation="horizontal"
              style={{
                backgroundColor: "rgb(72 71 71 / 66%)",
                marginTop: theme.spacing(1),
              }}
            />
          </Box>
          {PAYMENT_OPTIONS.map((item, index) => (
            <ButtonBase
              key={`CARD_${index}`}
              className={classes.paymentInfoBtn}
              onClick={() => setPaymentMethod(item)}
            >
              <Box display="flex" alignItems="center" style={{ width: "100%" }}>
                <Radio
                  color="primary"
                  checked={paymentMethod.id === item.id}
                  onChange={() => setPaymentMethod(item)}
                />
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  flexGrow={1}
                  style={{
                    backgroundColor: "#F3F4F8",
                    borderRadius: 20,
                    padding: "8px",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    align="left"
                  >
                    {item.label}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    {item.icon}
                    {item.icon1 && (
                      <>
                        <Box ml={theme.spacing(1)} />
                        {item.icon1}
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
            </ButtonBase>
          ))}

          <Box mt={theme.spacing(2)} />
        </Container>
      </Paper>
      <Box
        display="flex"
        alignItems={"center"}
        justifyContent="center"
        mt={2}
        mb={2}
        style={{
          background: theme.palette.common.white,
          paddingBottom: theme.spacing(2),
          paddingTop: theme.spacing(2),
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2),
          marginTop: theme.spacing(4),
          boxShadow: "0px 0px 5px 1px rgba(0,0,0,0.2)",
          borderRadius: 20,
        }}
      >
        <Typography
          style={{
            fontWeight: 700,
            color: theme.palette.text.secondary,
            fontSize: "0.875rem",
          }}
        >
          {`${configuration.currencySymbol} ${calculateTotal()}`}
        </Typography>
        <Typography
          style={{
            ...theme.typography.caption,
            fontWeight: 700,
            color: theme.palette.common.black,
            padding: "8px 15px",
            borderRadius: 5,
            border: "1px solid theme.palette.common.black",
            margin: "0 8px",
          }}
        >
          {cart && cart.length}
        </Typography>
        <Button
          disabled={loading}
          style={{
            padding: `${theme.spacing(2)} 0`,
            background: theme.palette.primary.main,
            width: 280,
            maxWidth: "70%",
            borderRadius: 20,
          }}
          onClick={() => {
            if (validateOrder()) onPayment();
          }}
        >
          {loading ? (
            <CircularProgress color="secondary" size={20} />
          ) : (
            <Typography
              style={{
                ...theme.typography.body2,
                color: theme.palette.common.black,
                fontWeight: 700,
              }}
            >
              {t("orderBtn")}
            </Typography>
          )}
        </Button>
      </Box>
    </>
  );
}

export default PaymentCard;
