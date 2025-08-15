import React from 'react';
import { Dialog } from 'primereact/dialog';
import { IExtendedOrder, Items } from '@/lib/utils/interfaces';
import './order-detail-modal.css';

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
  const calculateSubtotal = (items: Items[]) => {
    let subTotal = 0;
    for (let i = 0; i < items.length; i++) {
      subTotal += items[i].variation.price * items[i].quantity;
    }
    return subTotal;
  };
  if (!restaurantData) return null;

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={`Order # ${restaurantData.orderId}`}
      className="custom-modal" // Added custom class for CSS override
    >
      <div className="order-details-container">
        {/* Items Section */}
        <div className="order-section">
          <h3 className="section-header">Items</h3>
          {restaurantData.items && restaurantData.items.length > 0 ? (
            <div className="item-list">
              {restaurantData.items.map((item, index) => (
                <div key={index} className="item-row">
                  <span>
                    {index + 1}. {item.title}
                  </span>
                  <span className="item-price">
                    {item.quantity} &#215; $
                    {(item.variation?.price ?? 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>No items available</p>
          )}
        </div>

        {/* Charges Section */}
        <div className="order-section">
          <h3 className="section-header">Charges</h3>
          <div className="charges-table">
            <div className="charges-row">
              <span>Subtotal</span>
              <span>${calculateSubtotal(restaurantData?.items)}</span>
            </div>
            <div className="charges-row">
              <span>Delivery Fee</span>
              <span>${(restaurantData.deliveryCharges ?? 0)?.toFixed(2)}</span>
            </div>
            <div className="charges-row">
              <span>Tax Charges</span>
              <span>${(restaurantData.taxationAmount ?? 0)?.toFixed(2)}</span>
            </div>
            <div className="charges-row">
              <span>Tip</span>
              <span>${(restaurantData.tipping ?? 0)?.toFixed(2)}</span>
            </div>
            <div className="charges-row total-row">
              <strong>Total</strong>
              <strong>${restaurantData.orderAmount}</strong>
            </div>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="order-section">
          <h3 className="section-header">Payment Method</h3>
          <div className="payment-section">
            <span className="payment-type">{restaurantData.paymentMethod}</span>
          </div>
          <div className="paid-amount">
            <span className="paid-label">Paid Amount</span>
            <span className="paid-value">
              ${(
                  restaurantData.orderAmount +
                  (restaurantData.deliveryCharges ?? 0) +
                  (restaurantData.taxationAmount ?? 0) +
                  (restaurantData.tipping ?? 0)
                ).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Delivery Address Section */}
        <div className="order-section">
          <h3 className="section-header">Delivery Address</h3>
          <p>{restaurantData.deliveryAddress.deliveryAddress}</p>
        </div>
      </div>
    </Dialog>
  );
};

export default OrderDetailModal;
