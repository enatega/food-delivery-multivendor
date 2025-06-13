import React from 'react'

const ListItem = ({item}) => {
  return (
    <li className='py-2'>
      {item.text}
    </li>
  )
}

export default ListItem
