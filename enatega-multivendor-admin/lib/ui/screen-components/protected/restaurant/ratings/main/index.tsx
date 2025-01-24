import React, { useState, useEffect, useContext } from 'react';
import { useQuery } from '@apollo/client';
import { GET_REVIEWS } from '@/lib/api/graphql/queries/ratings';
import CustomDataView from '@/lib/ui/useable-components/data-view';
import RatingsHeaderDataView from '../header/table-header';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import RatingSkeleton from '@/lib/ui/useable-components/custom-skeletons/rating.card.skeleton';
import { IItem, IReview } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';

const RatingMain: React.FC = () => {
  // Hooks
  const t = useTranslations();

  // States
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<IReview[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const { restaurantId } = restaurantLayoutContextData;

  const { loading, error, data } = useQuery(GET_REVIEWS, {
    variables: { restaurant: restaurantId },
  });

  useEffect(() => {
    filterReviews();
  }, [data, selectedActions, searchTerm]);

  const filterReviews = () => {
    if (!data || !data.reviews || data.reviews.length === 0) {
      setFilteredReviews([]);
      return;
    }

    let filtered = data.reviews;

    if (searchTerm) {
      filtered = filtered.filter((review: IReview) => {
        console.log(review.order);
        return (
          review.order?.user?.name
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase()) ||
          review.order?.items?.some((item: IItem) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      });
    }

    if (selectedActions.length > 0) {
      filtered = filtered.filter((review: IReview) => {
        return selectedActions.some((action) => {
          switch (action) {
            case '1-2 stars':
              return review.rating >= 1 && review.rating <= 2;
            case '3-4 stars':
              return review.rating >= 3 && review.rating <= 4;
            case '5 stars':
              return review.rating === 5;
            default:
              return false;
          }
        });
      });
    }

    setFilteredReviews(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  if (loading) return <RatingSkeleton />;
  if (error)
    return (
      <p>
        {t('Error')}: {error.message}
      </p>
    );

  return (
    <div className="p-3">
      {!data || !data.reviews || data.reviews.length === 0 ? (
        <div className="text-center">
          <p className="mt-8 text-gray-600">{t('No records found')}</p>
        </div>
      ) : (
        <CustomDataView
          products={filteredReviews}
          header={
            <RatingsHeaderDataView
              setSelectedActions={setSelectedActions}
              selectedActions={selectedActions}
              onSearch={handleSearch}
            />
          }
        />
      )}
    </div>
  );
};

export default RatingMain;
