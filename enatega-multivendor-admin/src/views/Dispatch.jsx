/* eslint-disable react/display-name */
import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useQuery, useMutation, useSubscription, gql } from '@apollo/client'
import DataTable from 'react-data-table-component'
import {
  getActiveOrders,
  getRidersByZone,
  subscriptionOrder,
  updateStatus,
  assignRider
} from '../apollo'
import Header from '../components/Headers/Header'
import CustomLoader from '../components/Loader/CustomLoader'
import { transformToNewline } from '../utils/stringManipulations'
import SearchBar from '../components/TableHeader/SearchBar'
import useGlobalStyles from '../utils/globalStyles'
import { customStyles } from '../utils/tableCustomStyles'
import { Container, MenuItem, Select, Box } from '@mui/material'
import { ReactComponent as DispatchIcon } from '../assets/svg/svg/Dispatch.svg'
import TableHeader from '../components/TableHeader'

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
const GET_ACTIVE_ORDERS = gql`
  ${getActiveOrders}
`

const Orders = props => {
  const [searchQuery, setSearchQuery] = useState('')
  const onChangeSearch = e => setSearchQuery(e.target.value)
  const [mutateUpdate] = useMutation(UPDATE_STATUS)
  const globalClasses = useGlobalStyles()
  const [mutateAssign] = useMutation(ASSIGN_RIDER)

  const riderFunc = row => {
    const { data: dataZone } = useQuery(GET_RIDERS_BY_ZONE, {
      variables: { id: row.zone._id }
    })
    return (
      <Select
        id="input-rider"
        name="input-rider"
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
  } = useQuery(GET_ACTIVE_ORDERS, { pollInterval: 3000 })

  const statusFunc = row => {
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
                  }
                })
              }}>
              Accept
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
              Reject
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
              Delivered
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
      name: 'Order Information',
      sortable: true,
      selector: 'orderId',
      cell: row => subscribeFunc(row)
    },
    {
      name: 'Restaurant',
      selector: 'restaurant.name'
    },
    {
      name: 'Payment',
      selector: 'paymentMethod'
    },
    {
      name: 'Status',
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
      name: 'Rider',
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
      name: 'Order time',
      cell: row => (
        <>{new Date(row.createdAt).toLocaleString().replace(/ /g, '\n')}</>
      )
    }
  ]

  const conditionalRowStyles = [
    {
      when: row => ['DELIVERED', 'CANCELLED'].includes(row.orderStatus),
      style: {
        backgroundColor: '#FDEFDD'
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
            title={<TableHeader title="Dispatch" />}
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
export default withTranslation()(Orders)
