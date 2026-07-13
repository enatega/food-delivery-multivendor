export interface IUploadImageToCloudinary {
  (file: string, url: string, preset: string): Promise<string>;
}
