import { makeStyles } from "@mui/styles";


const useStyle = makeStyles((theme) => ({
  heroSection: {
    width: '100%',
    height: '300px', // Adjusted height for smaller view
    position: 'relative',
    overflow: 'hidden',
    // marginTop: '60px',
    [theme.breakpoints.up('md')]: {
      height: '400px', // Larger height for bigger screens
    },
    [theme.breakpoints.up('lg')]: {
      height: '533px', // Even larger height for larger screens
    }
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute', // Make the image absolute to layer with overlay
    top: 0,
    left: 0
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Grey overlay with 50% opacity
    zIndex: 1, // Ensure the overlay is above the image
  },
  textOverlay: {
    position: 'absolute',
    top: '58%',
    left: '10%', // Aligning text to the left side
    transform: 'translateY(-50%)', // Only translating vertically
    color: '#fff',
    textAlign: 'left',
    width: '80%', // Make text container width responsive
    maxWidth: '1019px',
    zIndex: 2, // Ensure text is above the overlay
    [theme.breakpoints.down('sm')]: {
      left: '5%', // Adjust left position for small screens
      width: '90%',
    },
  },
  heroHeading: {
    fontSize: '48px',
    fontWeight: '600',
    marginBottom: '12px',
    [theme.breakpoints.up('md')]: {
      fontSize: '40px', // Larger font size for larger screens
      marginBottom: '16px',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '25px', // Smaller font size for small screens
    },
  },
  heroDescription: {
    fontSize: '20px',
    fontWeight: '300',
    [theme.breakpoints.up('md')]: {
      fontSize: '18px', // Larger font size for larger screens
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px', // Smaller font size for small screens
    },
  },
}));

export default useStyle;
