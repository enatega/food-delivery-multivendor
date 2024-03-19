import {
  Button,
  Grid,
  Input,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import React from "react";
import SearchIcon from "../../../assets/icons/SearchIcon";
import useStyles from "./styles";

function SearchRestaurant({ search, setSearch }) {
  const theme = useTheme();
  const extraSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles(extraSmall);

  return (
    <Grid container item className={`${classes.mt} ${classes.root}`}>
      <Grid item xs={1} sm={1} />
      <Grid container item xs={10} sm={8} className={classes.searchContainer}>
        <Paper
          elevation={0}
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            padding: "20px",
            background: theme.palette.common.white,
            borderRadius: 0,
          }}
        >
          <SearchIcon />
          <Input
            disableUnderline={true}
            fullWidth
            type="text"
            placeholder="Search for restaurant and cuisines"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            inputProps={{
              style: {
                borderWidth: 0,
                textOverflow: "ellipsis",
              },
            }}
          />
          {search ? (
            <Button onClick={() => setSearch("")} style={{ maxWidth: "auto" }}>
              <HighlightOffIcon
                style={{ color: theme.palette.text.secondary }}
              />
            </Button>
          ) : null}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default React.memo(SearchRestaurant);
