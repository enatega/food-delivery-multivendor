import { IGlobalComponentProps } from './global.interface';

// Types
type ImageOrientation = 'LANDSCAPE' | 'SQUARE';
type FileTypes =
  | 'image/webp'
  | 'image/jpg'
  | 'image/png'
  | 'video/mp4'
  | 'image/gif'
  | 'image/jpeg'
  | 'video/webm'
  | '.webm'
  | '.mp4';
type maxFileHeight = 512 | 1080 | 841;
type maxFileWidth = 1980 | 1080 | 841 | 512;
export interface IImageUploadComponentProps extends IGlobalComponentProps {
  name: string;
  title: string;
  page?: string;
  onSetImageUrl: (key: string, imageUrl: string) => void;
  showExistingImage?: boolean;
  existingImageUrl?: string | null;
  style?: React.CSSProperties;
  maxFileSize: number;
  maxFileWidth: maxFileWidth;
  maxFileHeight: maxFileHeight;
  fileTypes: FileTypes[];
  orientation?: ImageOrientation;
  maxVideoSize?: number;
  error?:string;
}
