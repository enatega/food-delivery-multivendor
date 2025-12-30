import { View } from 'react-native'
import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_WEEKLY_FOODS_DEALS } from '../../apollo/queries'
import SectionList from '../../components/SectionList'
import { GET_WEEKLY_FOODS_DEALS_WITH_DEAL } from '../../apollo/queries'

const Deals = () => {

  const { data, loading, error } = useQuery(GET_WEEKLY_FOODS_DEALS)
  const { data: weeklydealsData, loading: weeklydealsLoading, error: weeklydealsError } = useQuery(GET_WEEKLY_FOODS_DEALS_WITH_DEAL)
  // temporary comments for debugging
  // console.log('weekldealsData',JSON.stringify(weeklydealsData,null,2));
  // console.log('dealsLoading',weeklydealsLoading);
  // console.log('dealsError',weeklydealsError);

  // useEffect(() => {
  //   console.log('GET_WEEKLY_FOODS_DEALS_WITH_DEAL Query Data:', JSON.stringify(weeklydealsData?.getWeeklyFoodsDeals?.items,null,2))
  //   console.log('GET_WEEKLY_FOODS_DEALS_WITH_DEAL Loading:', weeklydealsLoading)
  //   console.log('GET_WEEKLY_FOODS_DEALS_WITH_DEAL Error:', weeklydealsError)
  // }, [data, loading, error])
  // useEffect(() => {
  //   console.log('GET_WEEKLY_FOODS_DEALS Query Data:', JSON.stringify(data?.getWeeklyFoodsDeals?.items,null,2)    )
  //   console.log('GET_WEEKLY_FOODS_DEALS Loading:', loading)
  //   console.log('GET_WEEKLY_FOODS_DEALS Error:', error)
  // }, [data, loading, error])

  return (
    <View>
      <SectionList 
        title="Limited time deals" 
        data={data?.getWeeklyFoodsDeals?.items || []} 
        loading={loading}
      />
    </View>
  )
}

export default Deals

