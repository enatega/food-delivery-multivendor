/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react'
import { withTranslation } from 'react-i18next'
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
import { gql, useQuery, useMutation } from '@apollo/client'
import Header from '../components/Headers/Header'
import ZoneComponent from '../components/Zone/Zone'
import CustomLoader from '../components/Loader/CustomLoader'
import { getZones, deleteZone } from '../apollo'
import DataTable from 'react-data-table-component'
import orderBy from 'lodash/orderBy'
import SearchBar from '../components/TableHeader/SearchBar'
import { customStyles } from '../utils/tableCustomStyles'
import useGlobalStyles from '../utils/globalStyles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import TableHeader from '../components/TableHeader'
import Alert from '../components/Alert'
import ConfigurableValues from '../config/constants'

const GET_ZONES = gql`
  ${getZones}
`
const DELETE_ZONE = gql`
  ${deleteZone}
`

const Zones = props => {
  const { t } = props
  const {PAID_VERSION} = ConfigurableValues()
  const [editModal, setEditModal] = useState(false)
  const [zones, setZone] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const onChangeSearch = e => setSearchQuery(e.target.value)

  const [mutate, { error, loading }] = useMutation(DELETE_ZONE, {
    refetchQueries: [{ query: GET_ZONES }]
  })
  const { data, loading: loadingQuery, refetch } = useQuery(GET_ZONES)
  const toggleModal = zone => {
    setEditModal(!editModal)
    setZone(zone)
  }
  const closeEditModal = () => {
    setEditModal(false)
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
                  mutate({ variables: { id: row._id } })
                  else{
                    setIsOpen(true)
                  setTimeout(() => {
                    setIsOpen(false)
                  }, 2000)
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
      ? data && data.zones
      : data &&
        data.zones.filter(zone => {
          return (
            zone.title.toLowerCase().search(regex) > -1 ||
            zone.description.toLowerCase().search(regex) > -1
          )
        })

  const globalClasses = useGlobalStyles()

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className={globalClasses.flex} fluid>
        <ZoneComponent />
        {/* Table */}
        {isOpen && (
          <Alert message={t('AvailableAfterPurchasing')} severity="warning" />
        )}
        {error ? <span>{`Error! ${error.message}`}</span> : null}
        {loading ? <CustomLoader /> : null}
        <DataTable
          subHeader={true}
          subHeaderComponent={
            <SearchBar
              value={searchQuery}
              onChange={onChangeSearch}
              onClick={() => refetch()}
            />
          }
          title={<TableHeader title={t('Zones')} />}
          columns={columns}
          data={filtered}
          pagination
          progressPending={loadingQuery}
          progressComponent={<CustomLoader />}
          sortFunction={customSort}
          defaultSortField="title"
          customStyles={customStyles}
          selectableRows
        />
        <Modal
          style={{
            width: '70%',
            marginLeft: '15%',
            overflowY: 'auto'
          }}
          open={editModal}
          onClose={() => {
            toggleModal()
          }}>
          <ZoneComponent zone={zones} onClose={closeEditModal} />
        </Modal>
      </Container>
    </>
  )
}

export default withTranslation()(Zones)
