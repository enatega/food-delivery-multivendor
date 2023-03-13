import React, { useState, useLayoutEffect, useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'
import analytics from '../../utils/analytics'

function HelpBrowser(props) {
  const { title, url } = props.route.params
  const [loading, loadingSetter] = useState(true)
  useEffect(() => {
    async function Track() {
      await analytics.track(analytics.events.NAVIGATE_TO_HELPBROWSER)
    }
    Track()
  }, [])
  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: null,
      headerTitle: title
    })
  }, [props.navigation])

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
