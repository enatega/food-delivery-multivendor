import {
  Box,
  Dialog,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Grid,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import React from "react";
import useStyles from "./styles";
import CloseIcon from "@mui/icons-material/Close";
import { ReactComponent as VoucherImage } from "../../assets/images/voucher.svg";
import { useTranslation } from 'react-i18next';

function Voucher({
  isVisible,
  toggleModal,
  couponError,
  couponText,
  setCouponText,
  couponLoading,
  mutateVoucher,
}) {
  const theme = useTheme();
  const classes = useStyles();
  const extraSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation()

  return (
    <Dialog
      //fullScreen={extraSmall}
      onClose={toggleModal}
      open={isVisible}
      scroll="body"
      maxWidth="md"
      PaperProps={{
        style: { borderRadius: 30, overflowY: "visible" },
      }}
    >
      <Box display="flex" justifyContent="flex-end">
        <IconButton
          size={extraSmall ? "medium" : "small"}
          onClick={toggleModal}
          className={classes.closeContainer}
        >
          <CloseIcon color="primary" />
        </IconButton>
      </Box>
      <Box
        mt={2}
        mb={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Typography
          className={classes.boldText}
          style={{ color: theme.palette.common.black }}
          variant="h5"
          align="center"
        >
          {t('applyAVoucher')}
        </Typography>
        <VoucherImage />
      </Box>
      <Grid
        container
        item
        justifyContent="space-between"
        className={classes.MV2}
      >
        <Grid item xs={12}>
          <Box display="flex" justifyContent={"center"}>
            <TextField
              className={classes.textContainer}
              variant="outlined"
              label={t('voucherCode')}
              size="small"
              error={!!couponError}
              helperText={couponError}
              value={couponText}
              onChange={(e) => {
                setCouponText(e.target.value);
              }}
              InputProps={{
                className: classes.inputprops,
              }}
              InputLabelProps={{
                style: {
                  fontSize: "14px",
                },
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent={"center"}>
            <Button
              variant="contained"
              disabled={couponLoading}
              disableElevation
              color="primary"
              className={classes.couponBtn}
              onClick={mutateVoucher}
            >
              {couponLoading ? (
                <CircularProgress size={18} />
              ) : (
                <Typography variant="caption" color="black" fontWeight={800}>
                  {t('apply')}
                </Typography>
              )}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default Voucher;
