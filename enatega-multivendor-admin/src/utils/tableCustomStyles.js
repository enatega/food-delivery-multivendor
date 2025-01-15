export const customStyles = {
  header: {
    style: {
      fontSize: '17px',
      fontWeight: 'bold',
      minHeight: '40px',
      paddingLeft: '16px',
      paddingRight: '8px',
      borderRadius: '20px 20px 0 0'
    }
  },
  headRow: {
    style: {
      backgroundColor: '#6FCF97',
      color: '#FFFFFF',
      fontSize: '16px',
      fontWeight: 'bold',
      minHeight: '40px',
      borderRadius: '0 0 20px 20px',
      borderBottom: 'none',
      alignItems: 'center',
      textAlign: 'center'
    },
    denseStyle: {
      minHeight: '32px'
    }
  },
  subHeader: {
    style: {
      minHeight: '0px',
      marginTop: -14,
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.09)'
    }
  },
  headCells: {
    style: {
      fontSize: '14px',
      color: 'white',
      fontWeight: 'bold'
    }
  },

  rows: {
    style: {
      fontSize: '13px',
      fontWeight: 400,
      minHeight: '40px',
      textAlign: 'center',
      '&:not(:last-of-type)': {
        borderBottomStyle: 'solid',
        borderBottomWidth: '0px'
      },
      '&:hover': {
        backgroundColor: '#f9fafc'
      }
    }
  },
  pagination: {
    style: {
      fontSize: '13px',
      minHeight: '50px',
      borderRadius: '0 0 20px 20px',
      textAlign: 'left'
    },
    pageButtonsStyle: {
      backgroundColor: 'transparent',
      '&:disabled': {
        cursor: 'unset',
        color: 'red',
        fill: '#5A5858'
      },
      '&:hover:not(:disabled)': {
        backgroundColor: '#90EA93'
      },
      '&:focus': {
        outline: 'none',
        backgroundColor: '#90EA93'
      }
    }
  }
}
