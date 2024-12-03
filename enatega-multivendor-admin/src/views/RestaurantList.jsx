/* eslint-disable react/display-name */
import React, { useMemo, useState } from 'react'
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
import { Container, Button, Box, useTheme, Snackbar } from '@mui/material'
import { customStyles } from '../utils/tableCustomStyles'
import useGlobalStyles from '../utils/globalStyles'
import { ReactComponent as RestIcon } from '../assets/svg/svg/Restaurant.svg'
import TableHeader from '../components/TableHeader'
import { useDebounce } from '../utils/debounce'

const GET_RESTAURANTS = gql`
  ${restaurants}
`
const DELETE_RESTAURANT = gql`
  ${deleteRestaurant}
`

const Restaurants = props => {
  const { t } = props
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500) // Debounce search query
  const [error, setError] = useState(null)
  const onChangeSearch = e => setSearchQuery(e.target.value)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const globalClasses = useGlobalStyles()

  const [mutate, { loading }] = useMutation(DELETE_RESTAURANT, {
    onError: error => {
      setError(error.graphQLErrors[0].message || 'Something went wrong')
    }
  })

  const { data, loading: loadingQuery, refetch, networkStatus } = useQuery(
    GET_RESTAURANTS,
    {
      variables: {
        page: page,
        rowsPerPage,
        search: debouncedSearchQuery.length > 3 ? debouncedSearchQuery : null
      },
      fetchPolicy: 'network-only'
    }
  )

  const handlePageChange = (currentPage) => {
    setPage(currentPage - 1) // DataTable uses 1-based indexing
  }

  const handlePerRowsChange = (newPerPage, currentPage) => {
    setRowsPerPage(newPerPage)
    setPage(currentPage - 1)
  }

   const totalCount = data?.restaurants?.totalCount 

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
      name: t('Image'),
      cell: row => (
        <>
          {!!row.image && (
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
      name: t('Name'),
      // sortable: true,
      selector: 'name',
      style: {
        cursor: 'pointer'
      }
    },
    {
      name: t('Address'),
      selector: 'address',
      style: {
        cursor: 'pointer'
      }
    },
    {
      name: t('OrderPrefix'),
      selector: 'orderPrefix',
      style: {
        cursor: 'pointer'
      }
    },
    {
      name: t('Vendor'),
      selector: 'owner',
      style: {
        cursor: 'pointer'
      },
      cell: row => <>{row.owner ? row.owner.email : null}</>
    },
    {
      name: t('Action'),
      cell: row => <>{actionButtons(row)}</>
    }
  ]
  const theme = useTheme()
  const actionButtons = row => {
    return (
      <>
        {loading ? (
          <Loader
            type="ThreeDots"
            color={theme.palette.error.light}
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

  const regex = useMemo(
    () =>
      searchQuery.length > 2
        ? new RegExp(searchQuery.toLowerCase(), 'g')
        : null,
    [searchQuery]
  )


  const restaurants = data?.restaurants?.restaurants;

  // const filtered = useMemo(() => {
  //   if (!data || !data.restaurants || !data.restaurants.restaurants) return []

  //   const restaurantList = data.restaurants.restaurants

  //   return searchQuery.length < 3
  //     ? restaurantList
  //     : restaurantList.filter(restaurant => {
  //         return (
  //           (restaurant.name &&
  //             restaurant.name
  //               .toLowerCase()
  //               .includes(searchQuery.toLowerCase())) ||
  //           (restaurant.orderPrefix &&
  //             restaurant.orderPrefix
  //               .toLowerCase()
  //               .includes(searchQuery.toLowerCase())) ||
  //           (restaurant.owner &&
  //             restaurant.owner.email
  //               .toLowerCase()
  //               .includes(searchQuery.toLowerCase())) ||
  //           (restaurant.address &&
  //             restaurant.address
  //               .toLowerCase()
  //               .includes(searchQuery.toLowerCase()))
  //         )
  //       })
  // }, [searchQuery, data])

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
            title={<TableHeader title={t('Restaurants')} />}
            columns={columns}
            data={restaurants}
            pagination
            paginationServer
            paginationPerPage={rowsPerPage}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
            progressPending={loading || networkStatus === 4}
            progressComponent={<CustomLoader />}
            pointerOnHover
            paginationTotalRows={totalCount}
            sortFunction={customSort}
            paginationDefaultPage={page + 1}
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
        <Snackbar
          open={error}
          autoHideDuration={5000}
          onClose={() => setError(null)}
          message={error}
        />
      </Container>
    </>
  )
}
export default withTranslation()(Restaurants)
