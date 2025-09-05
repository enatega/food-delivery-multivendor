import { gql } from "@apollo/client";

export const EDIT_RIDER = gql`
  mutation EditRider($riderInput: RiderInput!) {
    editRider(riderInput: $riderInput) {
      _id
      name
      username
      phone
      password
      vehicleType
      zone {
        _id
      }
    }
  }
`;

export const UPDATE_LOCATION = gql`
  mutation UpdateRiderLocation($latitude: String!, $longitude: String!) {
    updateRiderLocation(latitude: $latitude, longitude: $longitude) {
      _id
    }
  }
`;

export const UPDATE_AVAILABILITY = gql`
  mutation ToggleRider($id: String!) {
    toggleAvailablity(id: $id) {
      _id
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
  mutation UpdateRiderBussinessDetails(
    $bussinessDetails: BussinessDetailsInput
    $updateRiderBussinessDetailsId: String!
  ) {
    updateRiderBussinessDetails(
      bussinessDetails: $bussinessDetails
      id: $updateRiderBussinessDetailsId
    ) {
      _id
    }
  }
`;

export const UPDATE_WORK_SCHEDULE = gql`
  mutation UpdateWorkSchedule(
    $riderId: String!
    $workSchedule: [DayScheduleInput!]!
    $timeZone: String!
  ) {
    updateWorkSchedule(
      riderId: $riderId
      workSchedule: $workSchedule
      timeZone: $timeZone
    ) {
      _id
      timeZone
      workSchedule {
        day
        enabled
        slots {
          startTime
          endTime
        }
      }
    }
  }
`;

export const UPLOAD_IMAGE_TO_S3 = gql`
  mutation UploadImageToS3($image: String!) {
    uploadImageToS3(image: $image) {
      imageUrl
    }
  }
`;
