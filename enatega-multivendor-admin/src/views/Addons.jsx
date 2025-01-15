/* eslint-disable react/display-name */
import React, { useState } from 'react'
import Header from '../components/Headers/Header'
import AddonComponent from '../components/Addon/Addon'
import { getRestaurantDetail, deleteAddon } from '../apollo'
import CustomLoader from '../components/Loader/CustomLoader'
import DataTable from 'react-data-table-component'
import orderBy from 'lodash/orderBy'
import { withTranslation } from 'react-i18next'
import { useQuery, useMutation, gql } from '@apollo/client'
import SearchBar from '../components/TableHeader/SearchBar'
import useGlobalStyles from '../utils/globalStyles'
import {
  Container,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Typography,
  ListItemIcon
} from '@mui/material'
import { customStyles } from '../utils/tableCustomStyles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import TableHeader from '../components/TableHeader'
import Alert from '../components/Alert'
import ConfigurableValues from '../config/constants'

const GET_ADDONS = gql`
  ${getRestaurantDetail}
`
const DELETE_ADDON = gql`
  ${deleteAddon}
`
const Addon = props => {
  const { t } = props
  const {PAID_VERSION} = ConfigurableValues()
  const [addon, setAddon] = useState(null)
  const [editModal, setEditModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const onChangeSearch = e => setSearchQuery(e.target.value)

  const toggleModal = addon => {
    setEditModal(!editModal)
    setAddon(addon)
  }
  const closeEditModal = () => {
    setEditModal(false)
  }
  const restaurantId = localStorage.getItem('restaurantId')

  const { data, error: errorQuery, loading: loadingQuery, refetch } = useQuery(
    GET_ADDONS,
    {
      variables: { id: restaurantId }
    }
  )
  const [mutate, { loading }] = useMutation(DELETE_ADDON, {
    refetchQueries: [{ query: GET_ADDONS, variables: { id: restaurantId } }]
  })

  const customSort = (rows, field, direction) => {
    const handleField = row => {
      if (row[field] && isNaN(row[field])) {
        return row[field].toLowerCase()
      }
      return row[field]
    }
    return orderBy(rows, handleField, direction)
  }

  const columns = [
    {
      name: t('Title'),
      sortable: true,
      selector: 'title'
    },
    {
      name: t('Description'),
      sortable: true,
      selector: 'description'
    },
    {
      name: t('Minimum'),
      sortable: true,
      selector: 'quantityMinimum'
    },
    {
      name: t('Maximum'),
      sortable: true,
      selector: 'quantityMaximum'
    },
    {
      name: t('Action'),
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
                  console.log('PAID_VERSION', PAID_VERSION)
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
                  mutate({
                    variables: { id: row._id, restaurant: restaurantId }
                  })
                  else {
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
      ? data && data.restaurant.addons.filter(addon => addon.title !== 'Default Addon')
      : data &&
        data.restaurant.addons.filter(addon => {
          return (
            (addon.title.toLowerCase().search(regex) > -1 ||
            addon.description.toLowerCase().search(regex) > -1) &&
            addon.title !== 'Default Addon'
          )
        })
  const globalClasses = useGlobalStyles()

  return (
    <>
      <Header />
      {isOpen && (
        <Alert message={t('AvailableAfterPurchasing')} severity="warning" />
      )}
      {/* Page content */}
      <Container className={globalClasses.flex} fluid>
        <AddonComponent />
        {errorQuery && (
          <tr>
            <td>{`Error! ${errorQuery.message}`}</td>
          </tr>
        )}
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
            title={<TableHeader title={t('Addons')} />}
            columns={columns}
            data={data && data.restaurant ? filtered : {}}
            pagination
            progressPending={loading}
            progressComponent={<CustomLoader />}
            sortFunction={customSort}
            defaultSortField="title"
            customStyles={customStyles}
            selectableRows
          />
        )}
        <Modal
          style={{
            marginLeft: '13%',
            overflowY: 'auto'
          }}
          open={editModal}
          onClose={() => {
            toggleModal()
          }}>
          <AddonComponent addon={addon} onClose={closeEditModal} />
        </Modal>
      </Container>
    </>
  )
}
export default withTranslation()(Addon)
