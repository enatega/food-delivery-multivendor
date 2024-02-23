import React, { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import CouponComponent from '../components/Coupon/Coupon'
import Header from '../components/Headers/Header'
import CustomLoader from '../components/Loader/CustomLoader'
import DataTable from 'react-data-table-component'
import orderBy from 'lodash/orderBy'
import { getCoupons, deleteCoupon, editCoupon } from '../apollo'
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
  Switch,
  Typography,
  ListItemIcon
} from '@mui/material'
import { ReactComponent as CouponsIcon } from '../assets/svg/svg/Coupons.svg'
import TableHeader from '../components/TableHeader'

const GET_COUPONS = gql`
  ${getCoupons}
`
const EDIT_COUPON = gql`
  ${editCoupon}
`
const DELETE_COUPON = gql`
  ${deleteCoupon}
`

const Coupon = props => {
  const { t } = props
  const [editModal, setEditModal] = useState(false)
  const [coupon, setCoupon] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const onChangeSearch = e => setSearchQuery(e.target.value)
  const [mutateEdit] = useMutation(EDIT_COUPON)
  const [mutateDelete] = useMutation(DELETE_COUPON, {
    refetchQueries: [{ query: GET_COUPONS }]
  })
  const { data, error: errorQuery, loading: loadingQuery, refetch } = useQuery(
    GET_COUPONS
  )
  const toggleModal = coupon => {
    setEditModal(!editModal)
    setCoupon(coupon)
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
      name: t('Title'),
      sortable: true,
      selector: 'title'
    },
    {
      name: t('Discount'),
      sortable: true,
      selector: 'discount'
    },
    {
      name: t('Status'),
      cell: row => <>{statusChanged(row)}</>
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
      ? data && data.coupons
      : data &&
        data.coupons.filter(coupon => {
          return coupon.title.toLowerCase().search(regex) > -1
        })

  const statusChanged = row => {
    return (
      <>
        {row.enabled}
        <Switch
          size="small"
          defaultChecked={row.enabled}
          onChange={_event => {
            mutateEdit({
              variables: {
                couponInput: {
                  _id: row._id,
                  title: row.title,
                  discount: row.discount,
                  enabled: !row.enabled
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
          <Grid item>
            <CouponComponent />
          </Grid>
          <Grid sx={{ display: { xs: 'none', lg: 'block' } }} item mt={2}>
            <CouponsIcon />
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
            title={<TableHeader title={t('Coupons')} />}
            columns={columns}
            data={filtered}
            pagination
            progressPending={loadingQuery}
            progressComponent={<CustomLoader />}
            sortFunction={customSort}
            defaultSortField="title"
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
          <CouponComponent coupon={coupon} />
        </Modal>
      </Container>
    </>
  )
}

export default withTranslation()(Coupon)
