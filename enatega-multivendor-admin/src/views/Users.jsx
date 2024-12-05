import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import Header from '../components/Headers/Header'
import CustomLoader from '../components/Loader/CustomLoader'
import { useQuery, gql } from '@apollo/client'
import { getUsers } from '../apollo'
import DataTable from 'react-data-table-component'
import orderBy from 'lodash/orderBy'
import SearchBar from '../components/TableHeader/SearchBar'
import { customStyles } from '../utils/tableCustomStyles'
import useGlobalStyles from '../utils/globalStyles'
import { Box, Container } from '@mui/material'
import { ReactComponent as UserIcon } from '../assets/svg/svg/User.svg'
import TableHeader from '../components/TableHeader'
import { useDebounce } from '../utils/debounce'

const GET_USERS = gql`
  ${getUsers}
`
const Users = props => {
  const { t } = props

  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500) // Debounce search query
  const onChangeSearch = e => setSearchQuery(e.target.value)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { data, error: errorQuery, loading: loadingQuery, refetch } = useQuery(
    GET_USERS,
    {
    variables: {
      page: page,
      rowsPerPage,
      search: debouncedSearchQuery.length > 3 ? debouncedSearchQuery : null
    },
    fetchPolicy: 'network-only',
  }
  )

  console.log("🚀 ~ Users ~ data:", data?.users)

  const handlePageChange = (currentPage) => {
    setPage(currentPage - 1) // DataTable uses 1-based indexing
  }

  const handlePerRowsChange = (newPerPage, currentPage) => {
    setRowsPerPage(newPerPage)
    setPage(currentPage - 1)
  }

  console.log("errorQuery",errorQuery);
  const columns = [
    {
      name: t('Name'),
      sortable: true,
      selector: 'name'
    },
    {
      name: t('Email'),
      sortable: true,
      selector: 'email',
      cell: row => hiddenData(row.email, 'EMAIL')
    },
    {
      name: t('Phone'),
      sortable: true,
      selector: 'phone',
      cell: row => hiddenData(row.phone, 'PHONE')
    }
  ]

  const hiddenData = (cell, column) => {
    if (column === 'EMAIL') {
      if (cell != null) {
        const splitArray = cell.split('@')
        splitArray.splice(0, 1, '*'.repeat(splitArray[0].length))
        const star = splitArray.join('@')
        return star
      } else {
        return '*'
      }
    } else if (column === 'PHONE') {
      const star = '*'.repeat(cell.length)
      return star
    }
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

  const handleSort = (column, sortDirection) =>
    console.log(column.selector, sortDirection)

    const userData = data?.users?.users
    const totalCount = data?.users?.totalCount

  const globalClasses = useGlobalStyles()
  return (
    <>
      <Header />
      <Box className={globalClasses.flexRow} mb={3}>
        <UserIcon />
      </Box>
      <Container classNname={globalClasses.flex} fluid>
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
            title={<TableHeader title={t('Users')} />}
            columns={columns}
            data={userData}
            pagination
            paginationServer
            paginationPerPage={rowsPerPage}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
            pointerOnHover
            progressPending={loadingQuery}
            paginationTotalRows={totalCount}
            progressComponent={<CustomLoader />}
            onSort={handleSort}
            sortFunction={customSort}
            paginationDefaultPage={page + 1}
            customStyles={customStyles}
            selectableRows
          />
        )}
      </Container>
    </>
  )
}
export default withTranslation()(Users)
