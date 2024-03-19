import React, { useContext, useEffect, useRef, useState } from 'react'

export const LocationContext = React.createContext()

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(null)
    const isInitialRender = useRef(true)
    useEffect(() => {
        const locationStr = localStorage.getItem('location')
        
        if (locationStr && locationStr !== "undefined") {
            setLocation(JSON.parse(locationStr))
        }
    }, [])
    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false
            return
        }
        if (location)
            localStorage.setItem('location', JSON.stringify(location))
    }, [location])

    
    return <LocationContext.Provider value={{ location, setLocation }}>
        {children}
    </LocationContext.Provider>
}

export const useLocationContext = () => useContext(LocationContext)
