import { gql } from "@apollo/client";

export const UPDATE_LOCATION = gql`
  mutation UpdateRiderLocation($latitude: String!, $longitude: String!) {
    updateRiderLocation(latitude: $latitude, longitude: $longitude) {
      _id
    }
  }
`;

export const UPDATE_AVAILABILITY = gql`
  mutation ToggleStore($restaurantId: String!) {
    toggleStoreAvailability(restaurantId: $restaurantId) {
      _id
      isAvailable
    }
  }
`;

export const UPDATE_LICENSE = gql`
  mutation UpdateRiderLicenseDetails(
    $updateRiderLicenseDetailsId: String!
    $licenseDetails: LicenseDetailsInput
  ) {
    updateRiderLicenseDetails(
      id: $updateRiderLicenseDetailsId
      licenseDetails: $licenseDetails
    ) {
      _id
    }
  }
`;
export const UPDATE_VEHICLE = gql`
  mutation UpdateRiderVehicleDetails(
    $updateRiderVehicleDetailsId: String!
    $vehicleDetails: VehicleDetailsInput
  ) {
    updateRiderVehicleDetails(
      id: $updateRiderVehicleDetailsId
      vehicleDetails: $vehicleDetails
    ) {
      _id
    }
  }
`;
export const UPDATE_BUSINESS_DETAILS = gql`
  mutation UpdateRestaurantBussinessDetails(
    $updateRestaurantBussinessDetailsId: String!
    $bussinessDetails: BussinessDetailsInput
  ) {
    updateRestaurantBussinessDetails(
      id: $updateRestaurantBussinessDetailsId
      bussinessDetails: $bussinessDetails
    ) {
      success
      message
      data {
        _id
      }
    }
  }
`;
