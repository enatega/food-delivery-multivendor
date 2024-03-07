/* eslint-disable react/display-name */
import React, { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import SectionComponent from '../components/Section/Section'
import CustomLoader from '../components/Loader/CustomLoader'

// core components
import { deleteSection, editSection, getSections } from '../apollo'
import Header from '../components/Headers/Header'
import DataTable from 'react-data-table-component'
import orderBy from 'lodash/orderBy'
import { customStyles } from '../utils/tableCustomStyles'
import useGlobalStyles from '../utils/globalStyles'
import {
  Container,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Switch,
  Typography,
  ListItemIcon,
  Grid
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import TableHeader from '../components/TableHeader'
import SearchBar from '../components/TableHeader/SearchBar'
import { ReactComponent as SectionIcon } from '../assets/svg/svg/RestaurantSection.svg'
import Alert from '../components/Alert'
import ConfigurableValues from '../config/constants'

const GET_SECTIONS = gql`
  ${getSections}
`
const EDIT_SECTION = gql`
  ${editSection}
`
const DELETE_SECTION = gql`
  ${deleteSection}
`

function Sections(props) {
  const { t } = props
  const {PAID_VERSION} = ConfigurableValues()
  const [editModal, setEditModal] = useState(false)
  const [sections, setSections] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const toggleModal = section => {
    setEditModal(!editModal)
    setSections(section)
  }

  // Callback function to close the modal
  const closeEditModal = () => {
    setEditModal(false)
  }

  const restaurantId = localStorage.getItem('restaurantId')

  const [mutateEdit] = useMutation(EDIT_SECTION)
  const [mutateDelete] = useMutation(DELETE_SECTION, {
    refetchQueries: [{ query: GET_SECTIONS }]
  })
  const { data, error: errorQuery, loading: loadingQuery } = useQuery(
    GET_SECTIONS,
    {
      variables: { id: restaurantId }
    }
  )
  console.log(data)

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
      name: t('Name'),
      sortable: true,
      selector: 'name'
    },
    {
      name: t('Status'),
      sortable: false,
      cell: row => <>{statusChanged(row)}</>
    },
    {
      name: t('Restaurants'),
      sortable: true,
      cell: row => <>{row.restaurants.map(item => `${item.name}`).join(', ')}</>
    },
    {
      name: t('Action'),
      cell: row => <>{actionButtons(row)}</>
    }
  ]

  const statusChanged = row => {
    return (
      <>
        {row.available}
        <Switch
          size="small"
          defaultChecked={row.enabled}
          onChange={() => {
            mutateEdit({
              variables: {
                section: {
                  _id: row._id,
                  name: row.name,
                  enabled: !row.enabled,
                  restaurants: row.restaurants
                    ? row.restaurants.map(r => r._id)
                    : []
                }
              }
            })
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

  const [searchQuery, setSearchQuery] = useState('')
  const onChangeSearch = e => setSearchQuery(e.target.value)
  const regex =
    searchQuery.length > 2 ? new RegExp(searchQuery.toLowerCase(), 'g') : null
  const filtered =
    searchQuery.length < 3
      ? data && data.sections
      : data &&
        data.sections.filter(section => {
          return section.name.toLowerCase().search(regex) > -1
        })

  const globalClasses = useGlobalStyles()

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className={globalClasses.flex} fluid>
        <Grid container>
          <Grid item lg={8} order={{ xs: 2, md: 1 }}>
            <SectionComponent />
          </Grid>
          <Grid
            sx={{ display: { xs: 'none', lg: 'block' } }}
            item
            lg={4}
            mt={5}
            order={{ xs: 1, lg: 2 }}>
            <SectionIcon />
          </Grid>
        </Grid>
        {isOpen && (
          <Alert message={t('AvailableAfterPurchasing')} severity="warning" />
        )}

        {/* Table */}
        {errorQuery && `${t('Error')}! ${errorQuery.message}`}
        {loadingQuery ? (
          <CustomLoader />
        ) : (
          <DataTable
            title={<TableHeader title={t('RestaurantSections')} />}
            subHeader={true}
            subHeaderComponent={
              <SearchBar
                value={searchQuery}
                onChange={onChangeSearch}
                // onClick={() => refetch()}
              />
            }
            columns={columns}
            data={filtered}
            pagination
            progressPending={loadingQuery}
            progressComponent={<CustomLoader />}
            sortFunction={customSort}
            defaultSortField="name"
            customStyles={customStyles}
            selectableRows
          />
        )}
        <Modal
          open={editModal}
          onClose={() => {
            toggleModal(null)
          }}
          style={{
            width: '65%',
            marginLeft: '18%',
            overflowY: 'auto'
          }}>
          <SectionComponent section={sections} onClose={closeEditModal} />
        </Modal>
      </Container>
    </>
  )
}

export default withTranslation()(Sections)
