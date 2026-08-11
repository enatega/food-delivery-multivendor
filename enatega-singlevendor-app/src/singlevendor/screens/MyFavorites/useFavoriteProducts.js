import { useQuery } from '@apollo/client'
import { GET_FAVORITE_FOODS_SINGLE_VENDOR } from '../../apollo/queries'

const useFavoriteProducts = ({
    skip = 0,
    limit = 10,
    skipQuery = false,
} = {}) => {

    const { data, loading, error, refetch } = useQuery(
        GET_FAVORITE_FOODS_SINGLE_VENDOR,
        {
            variables: {
                skip,
                limit,
            },
            skip: skipQuery,
            notifyOnNetworkStatusChange: true,
        }
    )
// console.log('usefavouriteProduct_Data',data);

    return {
        loading,
        data,
        error,
        refetch,
    }
}

export default useFavoriteProducts
