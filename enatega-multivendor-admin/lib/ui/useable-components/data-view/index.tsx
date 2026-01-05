import React from 'react';
import { DataView } from 'primereact/dataview';
import ProfileCard from '../Icon-Card';
import {
  ICustomDataViewProps,
  IReview,
} from '@/lib/utils/interfaces/ratings.interface';

const CustomDataView: React.FC<ICustomDataViewProps> = ({
  products,
  header,
}) => {
  const itemTemplate = (review: IReview) => {
    const orderedItems = review?.createdAt
      ? review.order.items.map((item) => item.title).join(', ')
      : '';

    const createdAt = review?.createdAt
      ? new Date(parseInt(review?.createdAt)).toLocaleDateString()
      : '';

    return (
      <div className="col-12 sm:col-6 lg:col-4 xl:col-3 mb-2">
        <ProfileCard
          name={review?.order?.user?.name}
          orderedItems={orderedItems}
          rating={review?.rating}
          imageSrc={review?.restaurant?.image}
          comments={review?.comments}
          reviewContent={review?.description}
          orderId={review?.order?.orderId}
          createdAt={createdAt}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-center">
      <DataView
        value={products}
        itemTemplate={itemTemplate}
        paginator
        rows={5}
        layout="grid"
        header={header}
      />
    </div>
  );
};

export default CustomDataView;
