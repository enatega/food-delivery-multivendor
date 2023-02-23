import React, { useState, useLayoutEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'
import { useNavigation, useRoute } from '@react-navigation/native'

function HelpBrowser() {
  const navigation = useNavigation()
  const route = useRoute()
  const [loading, loadingSetter] = useState(true)
  const { title, url } = route.params

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: null,
      headerTitle: title
    })
  }, [navigation])

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: url }}
        onLoad={() => {
          loadingSetter(false)
        }}
      />
      {loading ? (
        <ActivityIndicator
          style={{ position: 'absolute', bottom: '50%', left: '50%' }}
        />
      ) : null}
    </View>
  )
}

export default HelpBrowser
