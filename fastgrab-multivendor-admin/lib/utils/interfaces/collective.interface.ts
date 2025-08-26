import { IRestaurantResponse } from './restaurant.interface';
import { IRiderResponse } from './rider.interface';

export interface IStoreRidersResponse {
  restaurants: IRestaurantResponse[];
  riders: IRiderResponse[];
}
