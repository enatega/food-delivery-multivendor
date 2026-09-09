export interface ICouponRestaurantForm {
  title: string;
  discount: number | null;
  startDate: Date | null;
  endDate: Date | null;
  enabled: boolean;
}
