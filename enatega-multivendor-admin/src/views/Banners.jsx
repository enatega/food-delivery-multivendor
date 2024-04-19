import React, { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import Header from '../components/Headers/Header'
import CustomLoader from '../components/Loader/CustomLoader'
import DataTable from 'react-data-table-component'
import orderBy from 'lodash/orderBy'
import { getBanners, editBanner, deleteBanner } from '../apollo'
import SearchBar from '../components/TableHeader/SearchBar'
import useGlobalStyles from '../utils/globalStyles'
import { customStyles } from '../utils/tableCustomStyles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Typography,
  ListItemIcon
} from '@mui/material'
import TableHeader from '../components/TableHeader'
import BannerComponent from '../components/Banner/Banner'

const GET_BANNERS = gql`
  ${getBanners}
`
const EDIT_BANNER = gql`
  ${editBanner}
`
const DELETE_BANNER = gql`
  ${deleteBanner}
`

const Banners = props => {
  const { t } = props
  const [editModal, setEditModal] = useState(false)
  const [banner, setBanner] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const onChangeSearch = e => setSearchQuery(e.target.value)
  const [mutateEdit] = useMutation(EDIT_BANNER)
  const [mutateDelete] = useMutation(DELETE_BANNER, {
    refetchQueries: [{ query: GET_BANNERS }]
  })
  const { data, error: errorQuery, loading: loadingQuery, refetch } = useQuery(
    GET_BANNERS
  )
  const toggleModal = banner => {
    setEditModal(!editModal)
    setBanner(banner)
  }

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
      name: t('Image'),
      cell: row => (
        <>
          <img
            className="img-responsive"
            style={{ width: 30, height: 30, borderRadius: 15 }}
            src={
              row.file ||
              'https://enatega.com/wp-content/uploads/2023/11/man-suit-having-breakfast-kitchen-side-view.webp'
            }
            alt=''
          />
        </>
      )
    },
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
      name: t('Screen'),
      sortable: true,
      selector: 'screen'
    },
    {
      name: t('Action'),
      sortable: true,
      selector: 'action'
    },
    {
      name: t('Action'),
      cell: row => <>{actionButtons(row)}</>
    }
  ]
  const regex =
    searchQuery.length > 2 ? new RegExp(searchQuery.toLowerCase(), 'g') : null
  const filtered =
    searchQuery.length < 3
      ? data && data.banners
      : data &&
        data.banners.filter(banner => {
          return banner.title.toLowerCase().search(regex) > -1
        })

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
                  toggleModal(row)
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
                  mutateDelete({ variables: { id: row._id } })
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
  const globalClasses = useGlobalStyles()
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className={globalClasses.flex} fluid>
        <Grid container>
          <Grid item xs={12} lg={8}>
            <BannerComponent />
          </Grid>
        </Grid>

        {errorQuery ? (
          <span>
            `${t('Error')}! ${errorQuery.message}`
          </span>
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
            title={<TableHeader title={t('Banners')} />}
            columns={columns}
            data={filtered}
            pagination
            progressPending={loadingQuery}
            progressComponent={<CustomLoader />}
            sortFunction={customSort}
            defaultSortField="name"
            customStyles={customStyles}
          />
        )}
        <Modal
          open={editModal}
          onClose={() => {
            toggleModal(null)
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <BannerComponent banner={banner} />
        </Modal>
      </Container>
    </>
  )
}

export default withTranslation()(Banners)
