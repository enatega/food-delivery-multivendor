/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react'
import { withTranslation } from 'react-i18next'
import { Container, MenuItem, Select, useTheme } from '@mui/material'
import { useQuery, useMutation, useSubscription, gql } from '@apollo/client'
import DataTable from 'react-data-table-component'
import { getActiveOrders, subscriptionOrder, updateStatus } from '../apollo'
import Header from '../components/Headers/Header'
import CustomLoader from '../components/Loader/CustomLoader'
import { transformToNewline } from '../utils/stringManipulations'
import SearchBar from '../components/TableHeader/SearchBar'
import { useParams } from 'react-router-dom'
import { customStyles } from '../utils/tableCustomStyles'
import useGlobalStyles from '../utils/globalStyles'
import TableHeader from '../components/TableHeader'

const SUBSCRIPTION_ORDER = gql`
  ${subscriptionOrder}
`
const UPDATE_STATUS = gql`
  ${updateStatus}
`
const GET_ACTIVE_ORDERS = gql`
  ${getActiveOrders}
`

const DispatchRestaurant = props => {
  const theme = useTheme()
  const { t } = props
  const params = useParams()

  const [restaurantId, seteRestaurantId] = useState(
    localStorage.getItem('restaurantId')
  )
  useEffect(() => {
    if (params.id) seteRestaurantId(params.id)
  }, [])
  const [searchQuery, setSearchQuery] = useState('')
  const onChangeSearch = e => setSearchQuery(e.target.value)
  const [mutateUpdate] = useMutation(UPDATE_STATUS)
  const globalClasses = useGlobalStyles()

  const {
    data: dataOrders,
    error: errorOrders,
    loading: loadingOrders,
    refetch: refetchOrders
  } = useQuery(GET_ACTIVE_ORDERS, {
    variables: { restaurantId },
    pollInterval: 3000,
    skip: restaurantId === null
  })

  const statusFunc = row => {
    return (
      <>
        <Select
          id="input-rider"
          name="input-rider"
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          style={{ width: '50px' }}
          className={globalClasses.selectInput}>
          <MenuItem style={{ color: 'black' }} value={''}>
            {t('Rider')}
          </MenuItem>
          {row.orderStatus === 'PENDING' && (
            <MenuItem
              style={{ color: 'black' }}
              onClick={() => {
                mutateUpdate({
                  variables: {
                    id: row._id,
                    orderStatus: 'ACCEPTED'
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
          {row.orderStatus}
          <br />
          {!['CANCELLED', 'DELIVERED'].includes(row.orderStatus) &&
            statusFunc(row)}
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
      ? dataOrders && dataOrders.getActiveOrders
      : dataOrders &&
        dataOrders.getActiveOrders.filter(order => {
          return (
            order.restaurant.name.toLowerCase().search(regex) > -1 ||
            order.orderId.toLowerCase().search(regex) > -1 ||
            order.deliveryAddress.deliveryAddress.toLowerCase().search(regex) >
              -1 ||
            order.orderId.toLowerCase().search(regex) > -1 ||
            order.paymentMethod.toLowerCase().search(regex) > -1 ||
            order.orderStatus.toLowerCase().search(regex) > -1 ||
            (order.rider !== null
              ? order.rider.name.toLowerCase().search(regex) > -1
              : false)
          )
        })

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className={globalClasses.flex} fluid>
        {errorOrders ? (
          <tr>
            <td>{`${t('Error')} ${errorOrders.message}`}</td>
          </tr>
        ) : null}
        {loadingOrders ? (
          <CustomLoader />
        ) : (
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
            data={filtered}
            progressPending={loadingOrders}
            pointerOnHover
            progressComponent={<CustomLoader />}
            pagination
            conditionalRowStyles={conditionalRowStyles}
            customStyles={customStyles}
            selectableRows
          />
        )}
      </Container>
    </>
  )
}
export default withTranslation()(DispatchRestaurant)
