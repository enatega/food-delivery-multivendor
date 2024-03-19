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

const GET_USERS = gql`
  ${getUsers}
`
const Users = props => {
  const { t } = props

  const [searchQuery, setSearchQuery] = useState('')
  const onChangeSearch = e => setSearchQuery(e.target.value)
  const { data, error: errorQuery, loading: loadingQuery, refetch } = useQuery(
    GET_USERS,
    {
      variables: { page: 0 }
    }
  )
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

  const regex =
    searchQuery.length > 2 ? new RegExp(searchQuery.toLowerCase(), 'g') : null

  const filtered =
    searchQuery.length < 3
      ? data && data.users
      : data &&
        data.users.filter(user => {
          return (
            user.name.toLowerCase().search(regex) > -1 ||
            user.phone.toLowerCase().search(regex) > -1 ||
            (user.email !== null
              ? user.email.toLowerCase().search(regex) > -1
              : false)
          )
        })
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
            data={filtered}
            pagination
            progressPending={loadingQuery}
            progressComponent={<CustomLoader />}
            onSort={handleSort}
            sortFunction={customSort}
            customStyles={customStyles}
            selectableRows
            paginationIconLastPage=""
            paginationIconFirstPage=""
          />
        )}
      </Container>
    </>
  )
}
export default withTranslation()(Users)
