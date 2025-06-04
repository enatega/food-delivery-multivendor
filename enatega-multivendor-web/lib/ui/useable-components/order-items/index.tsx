import { IOrderItemsProps } from "@/lib/utils/interfaces";

const OrderItems = ({ order }: IOrderItemsProps) => {
  return (
    <div>
      {order?.items?.map((item) => (
        <div key={item?._id} className="mt-1">
          <div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              {item.quantity}x {item?.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderItems;
