/* eslint-disable react/display-name */
import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useQuery, useMutation, useSubscription, gql } from '@apollo/client'
import DataTable from 'react-data-table-component'
import {
  getRidersByZone,
  subscriptionOrder,
  updateStatus,
  assignRider, 
  getActiveOrdersWithPagination
} from '../apollo'
import Header from '../components/Headers/Header'
import CustomLoader from '../components/Loader/CustomLoader'
import { transformToNewline } from '../utils/stringManipulations'
import SearchBar from '../components/TableHeader/SearchBar'
import useGlobalStyles from '../utils/globalStyles'
import { customStyles } from '../utils/tableCustomStyles'
import { Container, MenuItem, Select, Box, useTheme } from '@mui/material'
import { ReactComponent as DispatchIcon } from '../assets/svg/svg/Dispatch.svg'
import TableHeader from '../components/TableHeader'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import 'react-notifications/lib/notifications.css'

const SUBSCRIPTION_ORDER = gql`
  ${subscriptionOrder}
`
const UPDATE_STATUS = gql`
  ${updateStatus}
`
const ASSIGN_RIDER = gql`
  ${assignRider}
`
const GET_RIDERS_BY_ZONE = gql`
  ${getRidersByZone}
`
const GET_ACTIVE_ORDERS_WITH_PAGINATION = gql`
  ${getActiveOrdersWithPagination}
`



const Orders = props => {
  const theme = useTheme()
  const { t } = props
  const [searchQuery, setSearchQuery] = useState('')
  const onChangeSearch = e => setSearchQuery(e.target.value)
  const [mutateUpdate] = useMutation(UPDATE_STATUS)
  const globalClasses = useGlobalStyles()
  const [mutateAssign] = useMutation(ASSIGN_RIDER)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const riderFunc = row => {
    const { data: dataZone } = useQuery(GET_RIDERS_BY_ZONE, {
      variables: { id: row.zone._id }
    })
    return (
      <Select
        id="input-rider"
        name="input-rider"
        value=""
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
        style={{ width: '50px' }}
        className={globalClasses.selectInput}>
        {dataZone &&
          dataZone.ridersByZone.map(rider => (
            <MenuItem
              style={{ color: 'black' }}
              onClick={() => {
                mutateAssign({
                  variables: {
                    id: row._id,
                    riderId: rider._id
                  },
                  onCompleted: data => {
                    console.error('Mutation success data:', data)
                    NotificationManager.success(
                      'Successful',
                      'Rider updated!',
                      3000
                    )
                  },
                  onError: error => {
                    console.error('Mutation error:', error)
                    NotificationManager.error(
                      'Error',
                      'Failed to update rider!',
                      3000
                    )
                  }
                })
              }}
              key={rider._id}>
              {rider.name}
            </MenuItem>
          ))}
      </Select>
    )
  }

  const {
    data: dataOrders,
    error: errorOrders,
    loading: loadingOrders,
    refetch: refetchOrders
  } = useQuery(GET_ACTIVE_ORDERS_WITH_PAGINATION, {
    variables: {
      page,
      rowsPerPage,
      search: searchQuery.length > 5 ? searchQuery : ''
    },
    pollInterval: 100000
  })

  const handlePageChange = (currentPage) => {
    setPage(currentPage - 1) // DataTable uses 1-based indexing
  }

  const handlePerRowsChange = (newPerPage, currentPage) => {
    setRowsPerPage(newPerPage)
    setPage(currentPage - 1)
  }

  const statusFunc = row => {
    const handleStatusSuccessNotification = status => {
      NotificationManager.success(
        t('Status updated to {{status}}', { status: t(status) }),
        t('StatusUpdated'),
        3000
      )
    }

    const handleStatusErrorNotification = error => {
      NotificationManager.error(t('Error'), t('Failed to update status!'), 3000)
    }

    return (
      <>
        <Select
          id="input-status"
          name="input-status"
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          style={{ width: '50px' }}
          className={globalClasses.selectInput}>
          {row.orderStatus === 'PENDING' && (
            <MenuItem
              style={{ color: 'black' }}
              onClick={() => {
                mutateUpdate({
                  variables: {
                    id: row._id,
                    orderStatus: 'ACCEPTED'
                  },
                  onCompleted: data => {
                    handleStatusSuccessNotification('ACCEPTED')
                    refetchOrders()
                  },
                  onError: error => {
                    console.error('Mutation error:', error)
                    handleStatusErrorNotification('Error')
                  }
                })
              }}>
              {t('Accept')}
            </MenuItem>
          )}
          {['PENDING', 'ACCEPTED', 'PICKED', 'ASSIGNED'].includes(
            row.orderStatus
          ) && (
            <MenuItem
              style={{ color: 'black' }}
              onClick={() => {
                mutateUpdate({
                  variables: {
                    id: row._id,
                    orderStatus: 'CANCELLED'
                  },
                  onCompleted: data => {
                    handleStatusSuccessNotification('REJECTED')
                    refetchOrders()
                  },
                  onError: error => {
                    console.error('Mutation error:', error)
                    handleStatusErrorNotification('Error')
                  }
                })
              }}>
              {t('Reject')}
            </MenuItem>
          )}
          {['PENDING', 'ACCEPTED', 'PICKED', 'ASSIGNED'].includes(
            row.orderStatus
          ) && (
            <MenuItem
              style={{ color: 'black' }}
              onClick={() => {
                mutateUpdate({
                  variables: {
                    id: row._id,
                    orderStatus: 'DELIVERED'
                  },
                  onCompleted: data => {
                    handleStatusSuccessNotification('DELIVERED')
                    refetchOrders()
                  },
                  onError: error => {
                    console.error('Mutation error:', error)
                    handleStatusErrorNotification('Error')
                  }
                })
              }}>
              {t('Delivered')}
            </MenuItem>
          )}
        </Select>
      </>
    )
  }
  const subscribeFunc = row => {
    const { data: dataSubscription } = useSubscription(SUBSCRIPTION_ORDER, {
      variables: { id: row._id }
    })
    console.log(dataSubscription)
    return (
      <div style={{ overflow: 'visible', whiteSpace: 'pre' }}>
        {row.orderId}
        <br />
        {transformToNewline(row.deliveryAddress.deliveryAddress, 3)}
      </div>
    )
  }
  const columns = [
    {
      name: t('OrderInformation'),
      sortable: true,
      selector: 'orderId',
      cell: row => subscribeFunc(row)
    },
    {
      name: t('RestaurantCol'),
      selector: 'restaurant.name'
    },
    {
      name: t('Payment'),
      selector: 'paymentMethod'
    },
    {
      name: t('Status'),
      selector: 'orderStatus',
      cell: row => (
        <div style={{ overflow: 'visible' }}>
          {t(row.orderStatus)}
          <br />
          {!['CANCELLED', 'DELIVERED'].includes(row.orderStatus) &&
            statusFunc(row)}
        </div>
      )
    },
    {
      name: t('Rider'),
      selector: 'rider',
      cell: row => (
        <div style={{ overflow: 'visible' }}>
          {row.rider ? row.rider.name : ''}
          <br />
          {!row.isPickedUp &&
            !['CANCELLED', 'DELIVERED'].includes(row.orderStatus) &&
            riderFunc(row)}
        </div>
      )
    },
    {
      name: t('OrderTime'),
      cell: row => (
        <>{new Date(row.createdAt).toLocaleString().replace(/ /g, '\n')}</>
      )
    }
  ]

  const conditionalRowStyles = [
    {
      when: row => ['DELIVERED', 'CANCELLED'].includes(row.orderStatus),
      style: {
        backgroundColor: theme.palette.success.dark
      }
    }
  ]
  const regex =
    searchQuery.length > 2 ? new RegExp(searchQuery.toLowerCase(), 'g') : null

  const filtered =
    searchQuery.length < 3
      ? dataOrders && dataOrders.getActiveOrdersWithPagination.orders
      : dataOrders &&
        dataOrders.getActiveOrdersWithPagination.orders.filter(order => {
          return (
            order.restaurant.name.toLowerCase().search(regex) > -1 ||
            order.orderId.toLowerCase().search(regex) > -1 ||
            order.deliveryAddress.deliveryAddress.toLowerCase().search(regex) >
              -1 ||
            order.paymentMethod.toLowerCase().search(regex) > -1 ||
            order.orderStatus.toLowerCase().search(regex) > -1 ||
            (order.rider
              ? order.rider.name.toLowerCase().search(regex) > -1
              : false)
          )
        })

  return (
    <>
      <NotificationContainer />
      <Header />
      <Box className={globalClasses.flexRow} mb={3}>
        <DispatchIcon />
      </Box>
      <Container className={globalClasses.flex} fluid>
        {errorOrders ? (
          <tr>
            <td>
              `${'Error'}! ${errorOrders.message}`
            </td>
          </tr>
        ) : null}
        {/* {loadingOrders ? (
          <CustomLoader />
        ) : ( */}
          <DataTable
            subHeader={true}
            subHeaderComponent={
              <SearchBar
                value={searchQuery}
                onChange={onChangeSearch}
                onClick={() => refetchOrders()}
              />
            }
            title={<TableHeader title={t('Dispatch')} />}
            columns={columns}
            data={filtered || []}
            pagination
            paginationServer
            paginationTotalRows={
              dataOrders?.getActiveOrdersWithPagination?.orderCount || 0
            }
            paginationPerPage={rowsPerPage}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
            progressPending={loadingOrders}
            pointerOnHover
            progressComponent={<CustomLoader />}
            conditionalRowStyles={conditionalRowStyles}
            customStyles={customStyles}
            selectableRows
          />
      </Container>
    </>
  )
}
export default withTranslation()(Orders)
