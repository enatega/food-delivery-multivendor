import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import useStyles from "./styles";
import { Link as RouterLink } from "react-router-dom";

export default function ModalView() {
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();
  const handleClose = () => setOpen(false);
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={classes.modal}>
          <Typography
            id="modal-modal-title"
            variant="h4"
            color={"primary"}
            style={{ fontWeight: 600 }}
            textAlign={"center"}
          >
            Your order was <br /> declined
          </Typography>
          <Box className={classes.btnWrapper}>
            <RouterLink
              to={"/restaurant-list"}
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="contained"
                disableElevation
                className={classes.btn}
              >
                Place another order
              </Button>
            </RouterLink>
            <Button
              variant="contained"
              disableElevation
              className={classes.btn}
              style={{ backgroundColor: "black", color: "white" }}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
