/* eslint-disable react/display-name */
import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { Container } from '@mui/material'
import Header from '../components/Headers/Header'
import DataTable from 'react-data-table-component'
import orderBy from 'lodash/orderBy'
import CustomLoader from '../components/Loader/CustomLoader'
import { useQuery, gql } from '@apollo/client'
import { reviews } from '../apollo'
import useGlobalStyles from '../utils/globalStyles'
import SearchBar from '../components/TableHeader/SearchBar'
import { customStyles } from '../utils/tableCustomStyles'
import TableHeader from '../components/TableHeader'

const REVIEWS = gql`
  ${reviews}
`

const Ratings = props => {
  const { t } = props
  const [searchQuery, setSearchQuery] = useState('')
  const onChangeSearch = e => setSearchQuery(e.target.value)
  const restaurantId = localStorage.getItem('restaurantId')

  const { data, error: errorQuery, loading: loadingQuery } = useQuery(REVIEWS, {
    variables: { restaurant: restaurantId }
  })

  const columns = [
    {
      name: t('Name'),
      sortable: true,
      selector: 'user.name',
      cell: row => <>{row.order.user.name}</>
    },
    {
      name: t('Email'),
      sortable: true,
      selector: 'user.email',
      cell: row => <>{row.order.user.email}</>
    },
    {
      name: t('Items'),
      cell: row => (
        <>
          {row.order.items.map(({ title }) => {
            return title + '\t'
          })}
        </>
      )
    },
    {
      name: t('Review'),
      sortable: true,
      selector: 'description',
      cell: row => <>{row.description}</>
    },
    {
      name: t('Ratings'),
      sortable: true,
      selector: 'rating',
      cell: row => <>{row.rating}</>
    }
  ]
  const propExists = (obj, path) => {
    return path.split('.').reduce((obj, prop) => {
      return obj && obj[prop] ? obj[prop] : ''
    }, obj)
  }

  const customSort = (rows, field, direction) => {
    const handleField = row => {
      if (field && isNaN(propExists(row, field))) {
        return propExists(row, field).toLowerCase()
      }

      return row[field]
    }

    return orderBy(rows, handleField, direction)
  }

  const handleSort = (column, sortDirection) =>
    console.log(column.selector, sortDirection, column)

  const regex =
    searchQuery.length > 2 ? new RegExp(searchQuery.toLowerCase(), 'g') : null
  const filtered =
    searchQuery.length < 3
      ? data && data.reviews
      : data &&
        data.reviews.filter(review => {
          return (
            review.user.name.toLowerCase().search(regex) > -1 ||
            review.user.email.toLowerCase().search(regex) > -1
          )
        })
  const globalClasses = useGlobalStyles()
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className={globalClasses.flex} fluid>
        {errorQuery && (
          <tr>
            <td>{`${t('Error')} ${errorQuery.message}`}</td>
          </tr>
        )}
        {loadingQuery ? (
          <CustomLoader />
        ) : (
          <DataTable
            title={<TableHeader title={t('Ratings')} />}
            subHeader={true}
            subHeaderComponent={
              <SearchBar value={searchQuery} onChange={onChangeSearch} />
            }
            columns={columns}
            data={filtered}
            pagination
            progressPending={loadingQuery}
            progressComponent={<CustomLoader />}
            onSort={handleSort}
            sortFunction={customSort}
            defaultSortField="order.user.name"
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

export default withTranslation()(Ratings)
