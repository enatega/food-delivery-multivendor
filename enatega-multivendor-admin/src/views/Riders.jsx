/* eslint-disable react/display-name */
import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useQuery, useMutation, gql } from '@apollo/client'
import Header from '../components/Headers/Header'
import CustomLoader from '../components/Loader/CustomLoader'
import DataTable from 'react-data-table-component'
import orderBy from 'lodash/orderBy'
import RiderComponent from '../components/Rider/Rider'
import SearchBar from '../components/TableHeader/SearchBar'
import {
  getRiders,
  deleteRider,
  toggleAvailablity,
  getAvailableRiders
} from '../apollo'
import useGlobalStyles from '../utils/globalStyles'
import {
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Switch,
  Typography,
  ListItemIcon
} from '@mui/material'
import { customStyles } from '../utils/tableCustomStyles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { ReactComponent as RiderIcon } from '../assets/svg/svg/Rider.svg'
import TableHeader from '../components/TableHeader'
import Alert from '../components/Alert'
import ConfigurableValues from '../config/constants'

const GET_RIDERS = gql`
  ${getRiders}
`
const DELETE_RIDER = gql`
  ${deleteRider}
`
const TOGGLE_RIDER = gql`
  ${toggleAvailablity}
`
const GET_AVAILABLE_RIDERS = gql`
  ${getAvailableRiders}
`

function Riders(props) {
  const {PAID_VERSION} = ConfigurableValues()
  const [editModal, setEditModal] = useState(false)
  const [rider, setRider] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const onChangeSearch = e => setSearchQuery(e.target.value)
  const [mutateToggle] = useMutation(TOGGLE_RIDER, {
    refetchQueries: [{ query: GET_RIDERS }, { query: GET_AVAILABLE_RIDERS }]
  })
  const [mutateDelete] = useMutation(DELETE_RIDER, {
    refetchQueries: [{ query: GET_RIDERS }]
  })
  const { data, error: errorQuery, loading: loadingQuery, refetch } = useQuery(
    GET_RIDERS
  )

  const toggleModal = rider => {
    setEditModal(!editModal)
    setRider(rider)
  }

  const closeEditModal = () => {
    setEditModal(false)
  }

  const customSort = (rows, field, direction) => {
    const handleField = row => {
      if (row[field]) {
        return row[field].toLowerCase()
      }

      return row[field]
    }

    return orderBy(rows, handleField, direction)
  }

  const handleSort = (column, sortDirection) =>
    console.log(column.selector, sortDirection)

  const { t } = props

  const columns = [
    {
      name: t('Name'),
      sortable: true,
      selector: 'name'
    },
    {
      name: t('Username'),
      sortable: true,
      selector: 'username'
    },
    {
      name: t('Password'),
      sortable: true,
      selector: 'password'
    },
    {
      name: t('Phone'),
      sortable: true,
      selector: 'phone'
    },
    {
      name: t('Zone'),
      selector: 'zone.title'
    },
    {
      name: t('Available'),
      cell: row => <>{availableStatus(row)}</>
    },
    {
      name: t('Action'),
      cell: row => <>{actionButtons(row)}</>
    }
  ]

  const availableStatus = row => {
    return (
      <>
        {row.available}
        <Switch
          size="small"
          defaultChecked={row.available}
          onChange={_event => {
            mutateToggle({ variables: { id: row._id } })
          }}
          style={{ color: 'black' }}
        />
      </>
    )
  }

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
                  
                  if(PAID_VERSION)
                  toggleModal(row)
                else{
                  setIsOpen(true)
                  setTimeout(() => {
                    setIsOpen(false)
                  }, 5000)
                }
                }}
                style={{ height: 25 }}>
                <ListItemIcon>
                  <EditIcon fontSize="small" style={{ color: 'green' }} />
                </ListItemIcon>
                <Typography color="green">{t('Edit')}</Typography>
              </MenuItem>
              <MenuItem
                onClick={e => {
                  e.preventDefault()
                  
                  if(PAID_VERSION)
                  mutateDelete({ variables: { id: row._id } })
                else{
                  setIsOpen(true)
                  setTimeout(() => {
                    setIsOpen(false)
                  }, 5000)
                }
                }}
                style={{ height: 25 }}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" style={{ color: 'red' }} />
                </ListItemIcon>
                <Typography color="red">{t('Delete')}</Typography>
              </MenuItem>
            </Menu>
          </Paper>
        </div>
      </>
    )
  }
  const regex =
    searchQuery.length > 2 ? new RegExp(searchQuery.toLowerCase(), 'g') : null
  const filtered =
    searchQuery.length < 3
      ? data && data.riders
      : data &&
        data.riders.filter(rider => {
          return (
            rider.name.toLowerCase().search(regex) > -1 ||
            rider.username.toLowerCase().search(regex) > -1 ||
            rider.phone.toLowerCase().search(regex) > -1 ||
            rider.zone.title.toLowerCase().search(regex) > -1
          )
        })
  const globalClasses = useGlobalStyles()
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className={globalClasses.flex} fluid>
        <Grid container>
          <Grid item order={{ xs: 2, md: 1 }}>
            <RiderComponent />
          </Grid>
          <Grid
            sx={{ display: { xs: 'none', lg: 'block' } }}
            item
            mt={5}
            order={{ xs: 1, lg: 2 }}>
            <RiderIcon />
          </Grid>
        </Grid>
        {isOpen && (
          <Alert message={t('AvailableAfterPurchasing')} severity="warning" />
        )}
        {/* Table */}
        {errorQuery ? (
          <tr>
            <td>`Error! ${errorQuery.message}`</td>
          </tr>
        ) : null}
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
            title={<TableHeader title={t('Riders')} />}
            columns={columns}
            data={filtered}
            pagination
            progressPending={loadingQuery}
            progressComponent={<CustomLoader />}
            onSort={handleSort}
            sortFunction={customSort}
            selectableRows
            customStyles={customStyles}
          />
        )}
        <Modal
          open={editModal}
          onClose={() => {
            toggleModal()
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <RiderComponent rider={rider} onClose={closeEditModal} />
        </Modal>
      </Container>
    </>
  )
}

export default withTranslation()(Riders)
