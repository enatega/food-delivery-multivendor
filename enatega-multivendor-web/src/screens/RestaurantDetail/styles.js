import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  marginHeader: {
    marginTop: "200px",
  },
  active: {
    color: theme.palette.text.secondary,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
  anchorStyle: {
    textDecoration: "none",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    cursor: "pointer",
  },
  tabTextStyle: {
    ...theme.typography.subtitle2,
    color: theme.palette.text.disabled,
    fontWeight: 600,
  },
  tabListStyle: {
    padding: "16px 16px 16px 16px",
  },
  imageContainer: {
    width: "100%",
    height: "324px",
    backgroundImage: `url('https://images.deliveryhero.io/image/fd-pk/LH/v1bq-hero.jpg?width=2000&amp;height=500')`,
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
  },
  tabContainer: {
    width: "100%",
    background: theme.palette.primary.light,
    height: "71px",
    display: "flex",
    alignItems: "center",
    position: "sticky",
    top: "140px",
    zIndex: 1200,
  },
  scrollpyStyles: {
    display: "flex",
    alignItems: "center",
    listStyleType: "none",
    width: "100%",
    paddingLeft: 0,
    paddingBottom: "4px",
    overflow: "auto",
  },
  categoriesStyle: {
    ...theme.typography.subtitle2,
    color: theme.palette.text.disabled,
  },
  spinnerContainer: {
    flexDirection: "row",
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(20, 0),
  },
}));

export default useStyles;
