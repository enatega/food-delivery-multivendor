import React, { useContext, useState } from 'react'
export const RestContext = React.createContext()

export const RestProvider = props => {
  const [image, setImage] = useState()
  const [name, setName] = useState()
  const [id, setId] = useState()
  return (
    <RestContext.Provider value={{ image, setImage, name, setName, id, setId }}>
      {props.children}
    </RestContext.Provider>
  )
}
export const useRestaurantContext = () => useContext(RestContext)
