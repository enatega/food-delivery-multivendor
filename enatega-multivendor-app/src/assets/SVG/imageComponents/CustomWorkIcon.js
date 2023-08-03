import React from 'react'
import { View, StyleSheet } from 'react-native'
import Svg, { Path } from 'react-native-svg'

const CustomWorkIcon = () => {
  return (
    <View style={styles.container}>
      <Svg width={50} height={50} >
        <Path
          d="M25.1429 10.625V8.5C25.1429 3.81305 21.0414 0 16 0C10.9586 0 6.85714 3.81305 6.85714 8.5V10.625H0V28.6875C0 31.6215 2.55836 34 5.71429 34H26.2857C29.4416 34 32 31.6215 32 28.6875V10.625H25.1429ZM11.4286 8.5C11.4286 6.15652 13.4793 4.25 16 4.25C18.5207 4.25 20.5714 6.15652 20.5714 8.5V10.625H11.4286V8.5ZM22.8571 16.4688C21.9104 16.4688 21.1429 15.7552 21.1429 14.875C21.1429 13.9948 21.9104 13.2813 22.8571 13.2813C23.8039 13.2813 24.5714 13.9948 24.5714 14.875C24.5714 15.7552 23.8039 16.4688 22.8571 16.4688ZM9.14286 16.4688C8.19607 16.4688 7.42857 15.7552 7.42857 14.875C7.42857 13.9948 8.19607 13.2813 9.14286 13.2813C10.0896 13.2813 10.8571 13.9948 10.8571 14.875C10.8571 15.7552 10.0896 16.4688 9.14286 16.4688Z"
          fill="#6FCF97"
        />
      </Svg>
    </View>
  )
}

export default CustomWorkIcon

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
