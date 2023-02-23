/* eslint-disable react/display-name */
import React, { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import CustomLoader from '../components/Loader/CustomLoader'
// core components
import Header from '../components/Headers/Header'
import { restaurants, deleteRestaurant } from '../apollo'
import DataTable from 'react-data-table-component'
import orderBy from 'lodash/orderBy'
import Loader from 'react-loader-spinner'
import SearchBar from '../components/TableHeader/SearchBar'
import { Container, Button, Box } from '@mui/material'
import { customStyles } from '../utils/tableCustomStyles'
import useGlobalStyles from '../utils/globalStyles'
import { ReactComponent as RestIcon } from '../assets/svg/svg/Restaurant.svg'
import TableHeader from '../components/TableHeader'

const GET_RESTAURANTS = gql`
  ${restaurants}
`
const DELETE_RESTAURANT = gql`
  ${deleteRestaurant}
`

const Restaurants = props => {
  const [searchQuery, setSearchQuery] = useState('')
  const onChangeSearch = e => setSearchQuery(e.target.value)
  const globalClasses = useGlobalStyles()

  const [mutate, { loading }] = useMutation(DELETE_RESTAURANT)
  const {
    data,
    loading: loadingQuery,
    refetch,
    networkStatus
  } = useQuery(GET_RESTAURANTS, { fetchPolicy: 'network-only' })
  const onClickRefetch = cb => {
    cb()
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

  const columns = [
    {
      name: 'Image',
      cell: row => (
        <>
          {!!row.image && (
            <img
              className="img-responsive"
              src={row.image}
              alt="img menu"
              style={{ width: 30, height: 30, borderRadius: 15 }}
              onClick={() => {
                localStorage.setItem('restaurant_id', row._id)
                props.history.push('/admin/dashboard')
              }}
            />
          )}
          {!row.image && 'No Image'}
        </>
      ),
      selector: 'image'
    },
    {
      name: 'Name',
      // sortable: true,
      selector: 'name'
    },
    {
      name: 'Address',
      selector: 'address'
    },
    {
      name: 'Order Prefix',
      selector: 'orderPrefix'
    },
    {
      name: 'Vendor',
      selector: 'owner',
      cell: row => <>{row.owner ? row.owner.email : null}</>
    },
    {
      name: 'Action',
      cell: row => <>{actionButtons(row)}</>
    }
  ]
  const actionButtons = row => {
    return (
      <>
        {loading ? (
          <Loader
            type="ThreeDots"
            color="#BB2124"
            height={20}
            width={40}
            visible={loading}
          />
        ) : null}
        <Button
          size="20px"
          variant="contained"
          color={row.isActive ? 'warning' : 'success'}
          sx={{ padding: 0, height: '15px', fontSize: '10px' }}
          onClick={e => {
            e.preventDefault()
            mutate({ variables: { id: row._id } })
          }}>
          {row.isActive ? 'Disable' : 'Enable'}
        </Button>
      </>
    )
  }

  const conditionalRowStyles = [
    {
      when: row => !row.isActive,
      style: {
        backgroundColor: '#f9fafc'
      }
    }
  ]

  const regex =
    searchQuery.length > 2 ? new RegExp(searchQuery.toLowerCase(), 'g') : null
  const filtered =
    searchQuery.length < 3
      ? data && data.restaurants
      : data &&
        data.restaurants.filter(restaurant => {
          return (
            restaurant.name.toLowerCase().search(regex) > -1 ||
            restaurant.orderPrefix.toLowerCase().search(regex) > -1 ||
            restaurant.owner.email.toLowerCase().search(regex) > -1 ||
            restaurant.address.toLowerCase().search(regex) > -1
          )
        })

  return (
    <>
      <Header />
      <Box className={globalClasses.flexRow} mb={3}>
        <RestIcon />
      </Box>
      <Container className={globalClasses.flex} fluid>
        {loadingQuery ? (
          <CustomLoader />
        ) : (
          <DataTable
            customStyles={customStyles}
            subHeader={true}
            subHeaderComponent={
              <SearchBar
                value={searchQuery}
                onChange={onChangeSearch}
                onClick={() => onClickRefetch(refetch)}
              />
            }
            title={<TableHeader title="Restaurants" />}
            columns={columns}
            data={filtered}
            pagination
            progressPending={loading || networkStatus === 4}
            progressComponent={<CustomLoader />}
            sortFunction={customSort}
            defaultSortField="name"
            onRowClicked={row => {
              localStorage.setItem('restaurantId', row._id)
              localStorage.setItem('restaurantImage', row.image)
              localStorage.setItem('restaurantName', row.name)
              props.history.push(`/admin/dashboard/${row.slug}`)
            }}
            conditionalRowStyles={conditionalRowStyles}
            selectableRows
          />
        )}
      </Container>
    </>
  )
}
export default withTranslation()(Restaurants)
