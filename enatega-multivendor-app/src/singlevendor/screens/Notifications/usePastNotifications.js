import { useQuery } from '@apollo/client'
import { GET_PAST_NOTIFICATIONS_BY_TOKEN } from '../../apollo/queries'

const usePastNotifications = ({
    skip = 0,
    limit = 10,
    skipQuery = false,
} = {}) => {

    const { data, loading, error, refetch } = useQuery(
        GET_PAST_NOTIFICATIONS_BY_TOKEN,
        {
            variables: {
                skip,
                limit,
            },
            skip: skipQuery,
            notifyOnNetworkStatusChange: true,
        }
    )

    const pageInfo = data?.pastNotificationsByToken
    const total = pageInfo?.total ?? 0
    const currentSkip = pageInfo?.skip ?? skip
    const currentLimit = pageInfo?.limit ?? limit
    const hasMore = pageInfo?.hasMore ?? false
    const isEndReached = !hasMore || total <= currentSkip + currentLimit
    const nextSkip = currentSkip + currentLimit

    return {
        loading,
        data,
        error,
        refetch,
        pageInfo: {
            total,
            skip: currentSkip,
            limit: currentLimit,
            hasMore,
            nextSkip,
            isEndReached,
            canShowMore: !isEndReached,
        },
    }
}

export default usePastNotifications
