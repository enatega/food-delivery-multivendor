import { ExternalPathString } from "expo-router";

export interface ICloudinaryResponse {
  access_mode: string;
  asset_id: string;
  bytes: number;
  created_at: string;
  etag: string;
  folder: string;
  format: string;
  height: number;
  original_filename: string;
  placeholder: false;
  public_id: ExternalPathString;
  resource_type: string;
  secure_url: ExternalPathString;
  signature: string;
  tags: string[];
  type: string;
  url: string;
  version: number;
  version_id: string;
  width: number;
}
