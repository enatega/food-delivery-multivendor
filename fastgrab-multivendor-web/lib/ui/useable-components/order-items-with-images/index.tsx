import { IOrder } from "@/lib/utils/interfaces";
import Image from "next/image";


interface IOrderItemsWithImagesProps {
    order?: IOrder;
}

const OrderItemsWithImages = ({order}: IOrderItemsWithImagesProps) => {
    return (
            <div className="mt-4 border-t pt-4">
                        <div className="text-sm text-gray-600 mb-2">
                            {order?.items?.length} {order?.items?.length === 1 ? "item" : "items"}
                        </div>
                        <div className="space-y-3">
                            {order?.items?.map((item, index) => (
                                <div
                                    key={item?._id || index}
                                    className="flex justify-between items-center"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 relative flex-shrink-0">
                                            <Image
                                                src={item?.image || "/placeholder.svg?height=48&width=48"}
                                                alt={item?.title || "Food item"}
                                                width={48}
                                                height={48}
                                                className="rounded-md object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="font-medium">{item?.title}</div>
                                            <div className="text-sm text-gray-600">
                                                {item?.quantity}x {item?.variation?.title}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
    )
}

export default OrderItemsWithImages