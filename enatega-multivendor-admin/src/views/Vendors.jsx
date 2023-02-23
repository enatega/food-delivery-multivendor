import React, { useState, useEffect } from 'react'
import { withTranslation } from 'react-i18next'
import { gql, useMutation, useQuery } from '@apollo/client'
import Header from '../components/Headers/Header'
import VendorComponent from '../components/Vendor/Vendor'
import CustomLoader from '../components/Loader/CustomLoader'
import { getVendors, deleteVendor } from '../apollo'
import DataTable from 'react-data-table-component'
import orderBy from 'lodash/orderBy'
import SearchBar from '../components/TableHeader/SearchBar'
import { customStyles } from '../utils/tableCustomStyles'
import useGlobalStyles from '../utils/globalStyles'
import {
  Container,
  Button,
  Grid,
  Modal,
  MenuItem,
  IconButton,
  Menu,
  ListItemIcon,
  Typography,
  Paper
} from '@mui/material'
import { ReactComponent as VendorIcon } from '../assets/svg/svg/Vendors.svg'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import TableHeader from '../components/TableHeader'

const GET_VENDORS = gql`
  ${getVendors}
`
const DELETE_VENDOR = gql`
  ${deleteVendor}
`
const Vendors = props => {
  const [editModal, setEditModal] = useState(false)
  const [vendors, setVendor] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const onChangeSearch = e => setSearchQuery(e.target.value)
  const golbalClasses = useGlobalStyles()

  const { loading: loadingQuery, error: errorQuery, data, refetch } = useQuery(
    GET_VENDORS
  )
  const [mutate, { loading }] = useMutation(DELETE_VENDOR, {
    refetchQueries: [{ query: GET_VENDORS }]
  })

  const regex =
    searchQuery.length > 2 ? new RegExp(searchQuery.toLowerCase(), 'g') : null

  const filtered =
    searchQuery.length < 3
      ? data && data.vendors
      : data &&
        data.vendors.filter(vendor => {
          return vendor.email.toLowerCase().search(regex) > -1
        })

  const toggleModal = vendor => {
    setEditModal(!editModal)
    setVendor(vendor)
  }

  useEffect(() => {
    localStorage.removeItem('restaurant_id')
  }, [])

  const customSort = (rows, field, direction) => {
    const handleField = row => {
      if (row[field]) {
        return row[field].toLowerCase()
      }

      return row[field]
    }

    return orderBy(rows, handleField, direction)
  }

  const columns = [
    {
      name: 'Email',
      sortable: true,
      selector: 'email'
    },
    {
      name: 'Total Restaurants',
      sortable: true,
      cell: row => <>{row.restaurants.length}</>
    },
    {
      name: 'Action',
      cell: row => <>{actionButtons(row)}</>
    }
  ]

  const actionButtons = row => {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const handleClick = event => {
      setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
      setAnchorEl(null)
    }
    return (
      <>
        <Button
          size="20px"
          variant="contained"
          sx={{
            color: 'black',
            fontWeight: 'bold',
            backgroundColor: '#90EA93',
            padding: 0,
            height: '15px',
            fontSize: '7px',
            '&:hover': {
              color: '#fff'
            }
          }}
          onClick={e => {
            e.preventDefault()
            localStorage.setItem('vendorId', row._id)
            props.history.push({
              pathname: '/restaurant/list',
              state: { id: row._id }
            })
          }}>
          Restaurants
        </Button>
        <div>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-haspopup="true"
            onClick={handleClick}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Paper>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button'
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}>
              <MenuItem
                onClick={e => {
                  e.preventDefault()
                  toggleModal(row)
                }}
                style={{ height: 25 }}>
                <ListItemIcon>
                  <EditIcon fontSize="small" style={{ color: 'green' }} />
                </ListItemIcon>
                <Typography color="green">Edit</Typography>
              </MenuItem>
              <MenuItem
                onClick={e => {
                  e.preventDefault()
                  mutate({ variables: { id: row._id } })
                }}
                style={{ height: 25 }}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" style={{ color: 'red' }} />
                </ListItemIcon>
                <Typography color="red">Delete</Typography>
              </MenuItem>
            </Menu>
          </Paper>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className={golbalClasses.flex}>
        <Grid container>
          <Grid item order={{ xs: 2, lg: 1 }}>
            <VendorComponent />
          </Grid>
          <Grid
            sx={{ display: { xs: 'none', lg: 'block' } }}
            item
            mt={5}
            ml={-2}
            order={{ xs: 1, lg: 2 }}>
            <VendorIcon />
          </Grid>
        </Grid>
        {errorQuery ? <span> `Error! ${errorQuery.message}`</span> : null}
        {loadingQuery ? (
          <CustomLoader />
        ) : (
          <DataTable
            subHeader={true}
            subHeaderComponent={
              <SearchBar
                value={searchQuery}
                onChange={onChangeSearch}
                onClick={() => refetch()}
              />
            }
            title={<TableHeader title="Vendors" />}
            columns={columns}
            data={filtered}
            pagination
            progressPending={loading}
            progressComponent={<CustomLoader />}
            sortFunction={customSort}
            defaultSortField="email"
            customStyles={customStyles}
            selectableRows
          />
        )}
        <Modal
          open={editModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClose={() => {
            toggleModal()
          }}>
          <VendorComponent vendor={vendors} />
        </Modal>
      </Container>
    </>
  )
}

export default withTranslation()(Vendors)
