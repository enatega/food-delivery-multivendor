/* eslint-disable react/display-name */
import React from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import CustomLoader from '../components/Loader/CustomLoader'
// core components
import Header from '../components/Headers/Header'
import { restaurants, deleteRestaurant } from '../apollo'
import DataTable from 'react-data-table-component'
import orderBy from 'lodash/orderBy'
import Loader from 'react-loader-spinner'
import SearchBar from '../components/TableHeader/SearchBar'
import { Container, Button, Box, useTheme } from '@mui/material'
import { customStyles } from '../utils/tableCustomStyles'
import useGlobalStyles from '../utils/globalStyles'
import { ReactComponent as RestaurantIcon } from '../assets/svg/svg/Restaurant.svg'
import TableHeader from '../components/TableHeader'
import { useNavigate } from 'react-router-dom' // Import useNavigate from react-router-dom

const GET_RESTAURANTS = gql`
  ${restaurants}
`
const DELETE_RESTAURANT = gql`
  ${deleteRestaurant}
`

const Restaurants = () => {
  const { t } = useTranslation() // Use the useTranslation hook
  const navigate = useNavigate() // Get the navigate function from the useNavigate hook
  const [searchQuery, setSearchQuery] = React.useState('')
  const onChangeSearch = e => setSearchQuery(e.target.value)
  const globalClasses = useGlobalStyles()
  const theme = useTheme()

  const { data, loading: loadingQuery, refetch, networkStatus } = useQuery(GET_RESTAURANTS, {
    fetchPolicy: 'network-only',
    onError: error => console.error('GraphQL Query Error:', error.message)
  })

  const [mutate, { loading: mutationLoading }] = useMutation(DELETE_RESTAURANT, {
    onError: error => console.error('GraphQL Mutation Error:', error.message)
  })

  const onClickRefetch = cb => {
    cb()
  }

  const customSort = (rows, field, direction) => {
    const handleField = row => (row[field] ? row[field].toLowerCase() : row[field])
    return orderBy(rows, handleField, direction)
  }

  const actionButtons = row => {
    return (
      <>
        {mutationLoading ? (
          <Loader
            type="ThreeDots"
            color={theme.palette.error.light}
            height={20}
            width={40}
            visible={mutationLoading}
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
          {row.isActive ? t('Disable') : t('Enable')}
        </Button>
      </>
    )
  }

  const conditionalRowStyles = [
    {
      when: row => !row.isActive,
      style: {
        backgroundColor: theme.palette.background.primary
      }
    }
  ]

  const regex =
    searchQuery.length >= 3 ? new RegExp(searchQuery.toLowerCase(), 'g') : null
  const filtered =
    searchQuery.length < 3
      ? data?.restaurants
      : data?.restaurants?.filter(restaurant =>
          [
            restaurant.name.toLowerCase(),
            restaurant.orderPrefix.toLowerCase(),
            restaurant.owner?.email?.toLowerCase(),
            restaurant.address.toLowerCase()
          ].some(field => field.includes(searchQuery.toLowerCase()))
        )

  return (
    <>
      <Header />
      <Box className={globalClasses.flexRow} mb={3}>
        <RestaurantIcon />
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
            title={<TableHeader title={t('Restaurants')} />}
            columns={[
              {
                name: t('Image'),
                cell: row => (
                  <>
                    {row.image && (
                      <img
                        className="img-responsive"
                        src={row.image}
                        alt={t('ImageMenu')}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          localStorage.setItem('restaurant_id', row._id)
                          navigate('/admin/dashboard')
                        }}
                      />
                    )}
                    {!row.image && 'No Image'}
                  </>
                ),
                selector: 'image'
              },
              { name: t('Name'), selector: 'name', style: { cursor: 'pointer' } },
              { name: t('Address'), selector: 'address', style: { cursor: 'pointer' } },
              {
                name: t('OrderPrefix'),
                selector: 'orderPrefix',
                style: { cursor: 'pointer' }
              },
              {
                name: t('Vendor'),
                selector: 'owner',
                style: { cursor: 'pointer' },
                cell: row => <>{row.owner?.email}</>,
              },
              { name: t('Action'), cell: actionButtons }
            ]}
            data={filtered}
            pagination
            progressPending={mutationLoading || networkStatus === 4}
            progressComponent={<CustomLoader />}
            sortFunction={customSort}
            defaultSortField="name"
            onRowClicked={row => {
              localStorage.setItem('restaurantId', row._id)
              localStorage.setItem('restaurantImage', row.image)
              localStorage.setItem('restaurantName', row.name)
              navigate(`/admin/dashboard/${row.slug}`)
            }}
            conditionalRowStyles={conditionalRowStyles}
            selectableRows
          />
        )}
      </Container>
    </>
  )
}

export default Restaurants