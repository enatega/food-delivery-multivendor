
export interface ICouponData {
  _id: string;
  title: string;
  discount: number;
  enabled: boolean;
}
export interface ICoupon {
  success:boolean;
  message: string;
  coupon: ICouponData | null;

}
