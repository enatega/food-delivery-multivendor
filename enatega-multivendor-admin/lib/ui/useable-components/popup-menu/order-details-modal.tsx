import React from 'react';
import { Dialog } from 'primereact/dialog';
import { IExtendedOrder, Items } from '@/lib/utils/interfaces';
import './order-detail-modal.css';
import { useConfiguration } from '@/lib/hooks/useConfiguration';

interface IOrderDetailModalProps {
  visible: boolean;
  onHide: () => void;
  restaurantData: IExtendedOrder | null;
}

const OrderDetailModal: React.FC<IOrderDetailModalProps> = ({
  visible,
  onHide,
  restaurantData,
}) => {
  const { CURRENCY_SYMBOL } = useConfiguration();
  const calculateSubtotal = (items: Items[]) => {
    let Subtotal = 0;
    for (let i = 0; i < items.length; i++) {
      let itemTotal = items[i].variation?.price ?? 0;
      if (items[i]?.addons) {
        items[i].addons?.forEach((addon) => {
          addon.options.forEach((option) => {
            itemTotal += option.price ?? 0;
          });
        });
      }
      Subtotal += itemTotal * items[i].quantity;
    }
    return Subtotal.toFixed(2);
  };
  if (!restaurantData) return null;

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={`Order # ${restaurantData.orderId}`}
      className="custom-modal border border-dark-600" // Added custom class for CSS override
    >
      <div className="order-details-container dark:bg-dark-900 dark:text-white ">
        {/* Items Section */}
        <div className="order-section dark:bg-dark-600">
          <h3 className="section-header dark:text-primary-dark">Items</h3>
          {restaurantData.items && restaurantData.items.length > 0 ? (
            <>
              <div className="item-list">
                {restaurantData.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <span>
                      {index + 1}. {item.title}
                    </span>
                    <span className="item-price dark:text-white">
                      {item.quantity} &#215; {CURRENCY_SYMBOL || '$'}
                      {(item.variation?.price ?? 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              {restaurantData?.items?.map((item, index) => (
                <div key={index}>
                  {item?.addons?.map((addon) =>
                    addon.options.map((option, index) => (
                      <div key={index} className="item-row">
                        <span>{option.title}</span>
                        <span className="item-price dark:text-white">
                          {CURRENCY_SYMBOL || '$'}
                          {(option.price ?? 0).toFixed(2)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              ))}
            </>
          ) : (
            <p>No items available</p>
          )}
        </div>

        {/* Charges Section */}
        <div className="order-section dark:bg-dark-600">
          <h3 className="section-header dark:text-primary-dark">Charges</h3>
          <div className="charges-table">
            <div className="charges-row">
              <span>Subtotal</span>
              <span>
                {CURRENCY_SYMBOL || '$'}
                {calculateSubtotal(restaurantData?.items || [])}
              </span>
            </div>
            <div className="charges-row">
              <span>Delivery Fee</span>
              <span>
                {CURRENCY_SYMBOL || '$'}
                {(restaurantData.deliveryCharges ?? 0)?.toFixed(2)}
              </span>
            </div>
            <div className="charges-row">
              <span>Tax Charges</span>
              <span>
                {CURRENCY_SYMBOL || '$'}
                {(restaurantData.taxationAmount ?? 0)?.toFixed(2)}
              </span>
            </div>
            <div className="charges-row">
              <span>Tip</span>
              <span>
                {CURRENCY_SYMBOL || '$'}
                {(restaurantData.tipping ?? 0)?.toFixed(2)}
              </span>
            </div>
            <div className="charges-row total-row">
              <strong>Total</strong>
              <strong>
                {CURRENCY_SYMBOL || '$'}
                {restaurantData.orderAmount}
              </strong>
            </div>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="order-section dark:bg-dark-600">
          <h3 className="section-header dark:text-primary-dark">
            Payment Method
          </h3>
          <div className="payment-section">
            <span className="payment-type">{restaurantData.paymentMethod}</span>
          </div>
          <div className="paid-amount">
            <span className="paid-label">Paid Amount</span>
            <span className="paid-value">
              {CURRENCY_SYMBOL || '$'}
              {(restaurantData.paidAmount ?? 0)?.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Delivery Address Section */}
        <div className="order-section dark:bg-dark-600">
          <h3 className="section-header dark:text-primary-dark">
            Delivery Address
          </h3>
          <p>{restaurantData.deliveryAddress.deliveryAddress}</p>
        </div>
      </div>
    </Dialog>
  );
};

export default OrderDetailModal;
