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
import { useTranslation } from 'react-i18next';

function SearchRestaurant({ search, setSearch }) {
  const { t  } = useTranslation();
  const theme = useTheme();
  const extraSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles(extraSmall);

  return (
    <Grid container item className={`${classes.root}`}>
      <Grid container item xs={12} className={classes.searchContainer}>
        <Paper
          elevation={0}
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            padding: "12px",
            background: theme.palette.common.white,
            borderRadius: 5,
          }}
        >
          <SearchIcon />
          <Input
            disableUnderline={true}
            fullWidth
            type="text"
            placeholder= {t('searchRestaurantPlaceholder')}
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
