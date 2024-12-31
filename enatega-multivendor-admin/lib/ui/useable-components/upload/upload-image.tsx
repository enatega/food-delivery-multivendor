// Contexts
import { ConfigurationContext } from '@/lib/context/global/configuration.context';
import { ToastContext } from '@/lib/context/global/toast.context';

// Utils
import { uploadImageToCloudinary } from '@/lib/services';

// Interfaces
import {
  IConfiguration,
  IImageUploadComponentProps,
} from '@/lib/utils/interfaces';
import Image from 'next/image';

// Hooks
import { memo, useCallback, useContext, useState } from 'react';

// Components
import CustomLoader from '../custom-progress-indicator';

// Prime React
import {
  FileUpload,
  FileUploadSelectEvent,
  ItemTemplateOptions,
} from 'primereact/fileupload';

// Icons
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { MAX_VIDEO_FILE_SIZE } from '@/lib/utils/constants';

function CustomUploadImageComponent({
  name,
  title,
  page,
  // onChange,
  onSetImageUrl,
  existingImageUrl,
  style,
  maxFileSize,
  maxFileWidth,
  maxFileHeight,
  fileTypes = ['image/webp', 'video/webm', 'video/mp4'],
  orientation,
  maxVideoSize = MAX_VIDEO_FILE_SIZE,
}: IImageUploadComponentProps) {
  // Context
  const configuration: IConfiguration | undefined =
    useContext(ConfigurationContext);
  const { showToast } = useContext(ToastContext);

  // States
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState('');
  const [currentFileType, setCurrentFileType] = useState('');
  const [imageValidationErr, setImageValidationErr] = useState({
    bool: false,
    msg: '',
  });

  // Validate Video
  const validateVideo = useCallback(
    async (file: File): Promise<boolean> => {
      return new Promise((resolve) => {
        const videoSize = file.size / (1024 * 1024);
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = () => {
          const isInvalidVideo =
            (orientation === 'LANDSCAPE' &&
              video.videoWidth <= video.videoHeight) ||
            (orientation === 'SQUARE' &&
              video.videoWidth !== video.videoHeight) ||
            video.videoHeight > video.videoWidth;
          if (videoSize > maxVideoSize) {
            showToast({
              type: 'error',
              title: 'Upload Video',
              message: `Video size must be < ${maxVideoSize}`,
            });
            setImageValidationErr({
              bool: true,
              msg: `Video size must be < ${maxVideoSize}`,
            });
            resolve(false);
            return false;
          } else if (video.videoWidth > maxFileWidth) {
            showToast({
              type: 'error',
              title: 'Upload Video',
              message: `Video width must be < ${maxFileWidth}`,
            });
            setImageValidationErr({
              bool: true,
              msg: `Video width must be < ${maxFileWidth}`,
            });
            resolve(false);
            return false;
          } else if (video.videoHeight > maxFileHeight) {
            showToast({
              type: 'error',
              title: 'Upload Video',
              message: `Video height must be < ${maxFileHeight}`,
            });
            setImageValidationErr({
              bool: true,
              msg: `Video height must be < ${maxFileHeight}`,
            });
            resolve(false);
            return false;
          } else if (isInvalidVideo) {
            showToast({
              type: 'error',
              title: 'Upload Video',
              message: `Video dimensions must follow the guidelines`,
            });
            setImageValidationErr({
              bool: true,
              msg: `Video dimensions must follow the guidelines`,
            });
            resolve(false);
            return false;
          } else {
            setImageValidationErr({
              bool: false,
              msg: ``,
            });
            resolve(true);
            return true;
          }
        };
        // Set the video source
        video.src = URL.createObjectURL(file);
      });
    },

    [maxFileHeight, maxFileWidth, orientation, showToast, maxVideoSize]
  );

  // Validate Image
  const validateImage = useCallback(
    async (file: File) => {
      let img = new window.Image();
      let fileReader = new FileReader();

      const { isValid } = await new Promise<{
        imgSrc: string;
        isValid: boolean;
      }>((resolve) => {
        try {
          fileReader.onload = (e: ProgressEvent<FileReader>) => {
            const result = e.target?.result as string;
            img.src = result;

            img.onload = () => {
              // Validate orientation
              const invalidOrientation =
                (orientation === 'LANDSCAPE' && img.width <= img.height) ||
                (orientation === 'SQUARE' && img.width !== img.height) ||
                img.height > img.width;

              if (invalidOrientation) {
                showToast({
                  type: 'error',
                  title: 'Image Upload',
                  message: `The image should be in ${orientation} orientation.`,
                });
                setImageValidationErr({
                  bool: true,
                  msg: `Image should be ${orientation} oriented.`,
                });
                setImageFile('');
                return resolve({ imgSrc: '', isValid: false });
              }

              // Validate width
              if (img.width > maxFileWidth) {
                showToast({
                  type: 'error',
                  title: 'Image Upload',
                  message: `The file width exceeds the limit of ${maxFileWidth}.`,
                });
                setImageValidationErr({
                  bool: true,
                  msg: `File width should be < ${maxFileWidth}`,
                });
                setImageFile('');
                return resolve({ imgSrc: '', isValid: false });
              }

              // Validate height
              if (img.height > maxFileHeight) {
                showToast({
                  type: 'error',
                  title: 'Image Upload',
                  message: `The file height exceeds the limit of ${maxFileHeight}.`,
                });
                setImageValidationErr({
                  bool: true,
                  msg: `File height should be < ${maxFileHeight}`,
                });
                setImageFile('');
                return resolve({ imgSrc: '', isValid: false });
              }

              // If all checks pass, set the image and resolve as valid
              setImageValidationErr({ bool: false, msg: '' });
              setImageFile(result);
              resolve({ imgSrc: result, isValid: true });
            };

            img.onerror = () => {
              showToast({
                type: 'error',
                title: 'Image Upload',
                message: 'An error occurred while loading the image.',
              });
              setImageValidationErr({
                bool: true,
                msg: 'Error during image load.',
              });
              setImageFile('');
              resolve({ imgSrc: '', isValid: false });
            };
          };

          fileReader.readAsDataURL(file);
        } catch (error) {
          console.error(error);
          showToast({
            type: 'error',
            title: 'Image Upload',
            message: 'An unexpected error occurred. Please try again.',
          });
          setImageValidationErr({
            bool: true,
            msg: 'Unexpected error occurred.',
          });
          setImageFile('');
          resolve({ imgSrc: '', isValid: false });
        }
      });

      return isValid; // This should now reflect the correct validation state
    },
    [maxFileHeight, maxFileWidth, orientation, showToast]
  );

  // Filter Files
  const filterFiles = (event: FileUploadSelectEvent): File | undefined => {
    const files = Array.from(event.files || []);
    const extracted_files = files.filter((file) =>
      file.name.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm)$/)
    );
    return extracted_files.length ? extracted_files[0] : undefined;
  };

  // Convert to Base64
  const imageToBase64 = useCallback(
    async (file: File): Promise<void> => {
      var isValid = false;
      setIsUploading(true);
      if (file?.type.startsWith('video/')) {
        isValid = await validateVideo(file);
      } else {
        isValid = await validateImage(file);
      }
      if (!isValid) {
        setIsUploading(false);
        return;
      } else {
        const fileReader = new FileReader();
        fileReader.onloadend = async () => {
          if (fileReader.result) {
            setImageFile(fileReader.result as string);
            const uploadURL = file?.type.startsWith('video/')
              ? configuration?.cloudinaryUploadUrl?.replace('image', 'video')
              : (configuration?.cloudinaryUploadUrl ?? '');
            await uploadImageToCloudinary(
              fileReader.result as string,
              uploadURL ?? '',
              configuration?.cloudinaryApiKey ?? ''
            )
              .then((url) => {
                isValid = false;
                onSetImageUrl(name, url);
                showToast({
                  type: 'info',
                  title: title,
                  message: `${fileTypes.includes('video/webm') || fileTypes.includes('video/mp4') ? 'File' : 'Image'} has been uploaded successfully.`,
                  duration: 2500,
                });
              })
              .catch((err) => {
                onSetImageUrl(name, '');
                showToast({
                  type: 'error',
                  title: title,
                  message: `${fileTypes.includes('video/webm') || fileTypes.includes('video/mp4') ? 'File' : 'Image'} Upload Failed`,
                  duration: 2500,
                });
                console.log('errrror=====>', err);
              })
              .finally(() => {
                setIsUploading(false);
              });
          }
        };
        fileReader.readAsDataURL(file);
      }
    },
    [
      name,
      onSetImageUrl,
      configuration?.cloudinaryApiKey,
      configuration?.cloudinaryUploadUrl,
      showToast,
      title,
      validateImage,
      fileTypes,
    ]
  );

  // Select Image
  const handleFileSelect = useCallback(
    (event: FileUploadSelectEvent): void => {
      const result = filterFiles(event);
      // Size and Resolution Check
      if (result) {
        setCurrentFileType(result.type);
        imageToBase64(result);
      }
    },
    [imageToBase64]
  );

  // Handle cancel click
  const handleCancelClick = (type: String) => {
    if (type === 'cancel') {
      setImageFile('');
      setImageValidationErr({
        bool: false,
        msg: '',
      });
      onSetImageUrl(name, '');
    } else {
      return;
    }
  };
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <span className="mx-auto self-start text-sm font-[600]">{title}</span>
      <div
        style={style}
        className={
          page && page === 'vendor-profile-edit'
            ? `bg-transparnt`
            : `mx-auto flex h-48 w-48 flex-col items-center justify-start border-2 border-dashed ${imageValidationErr.bool ? 'border-red-900' : 'border-gray-300'}`
        }
        // className="bg-transparnt"
      >
        <FileUpload
          accept={fileTypes?.join(',')}
          id={`${name}-upload`}
          className="mx-auto -mt-7 h-28 w-44 items-center justify-center rounded-md bg-transparent"
          onSelect={(e) => handleFileSelect(e)}
          emptyTemplate={() => {
            return (
              <div className="mx-auto h-auto w-40">
                {!isUploading && (
                  <div
                    className={`flex h-auto w-full flex-col items-center justify-center pt-5 text-center`}
                  >
                    {(page && page === 'vendor-profile-edit') ?? (
                      <>
                        <FontAwesomeIcon icon={faUpload} size="sm" />
                        <p className="w-36 text-xs text-gray-600">
                          Drag & Drop Image Here
                        </p>
                      </>
                    )}

                    <div className="flex w-12 flex-col items-center justify-center">
                      <div className="relative my-2 h-12 w-12 overflow-hidden rounded-md">
                        {existingImageUrl ? (
                          <Image
                            alt="User avatar"
                            src={existingImageUrl}
                            width={100}
                            height={100}
                          />
                        ) : imageFile ? (
                          <Image
                            alt="User avatar"
                            src={imageFile}
                            width={100}
                            height={100}
                          />
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          }}
          headerTemplate={(options) => {
            const { chooseButton, cancelButton } = options;
            return (
              <button
                type="button"
                onClick={() =>
                  handleCancelClick(imageFile ? 'cancel' : 'choose')
                }
              >
                {!imageFile || !imageValidationErr.bool
                  ? chooseButton
                  : cancelButton}
              </button>
            );
          }}
          chooseLabel="Upload Image"
          chooseOptions={
            page === 'vendor-profile-edit'
              ? {
                  className: `z-50 bg-white max-[500px]:ml-[-20px] ${!imageFile ? 'text-gray-700' : imageValidationErr.bool && !imageFile ? 'text-[#E4E4E7]' : 'text-[#E4E4E7]'} border border-[#E4E4E7] rounded-md items-center justify-center relative left-[20%] translate-y-[45px] w-[173px] h-[40px] text-[14px] gap-[5px] font-medium`,
                  label: 'Upload Image',
                  icon: () => <FontAwesomeIcon icon={faArrowUpFromBracket} />,
                }
              : {
                  className: `z-50 bg-gray-200 ${!imageFile ? 'text-gray-700' : imageValidationErr.bool && !imageFile ? 'text-red-900' : 'text-gray-700'} border border-gray-500 rounded-md items-center justify-center relative left-[20%] translate-y-[45px] w-32 h-8 text-xs`,
                  label: 'Browse Files',
                  icon: () => <></>,
                }
          }
          cancelOptions={{
            className: 'text-xs',
          }}
          // maxFileSize={maxFileSize}
          customUpload={true}
          itemTemplate={(file: object, object: ItemTemplateOptions) => {
            const extractedFile = file as File;
            // if(page && page === "vendor-profile-edit"){
            //   onChange(URL.createObjectURL(extractedFile));
            // }
            return (
              <div className="h-12">
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-opacity-50">
                    <CustomLoader />
                  </div>
                )}
                {!isUploading && (
                  <div className="top-0 flex items-center justify-center gap-1">
                    <div
                      className={
                        page && page === 'vendor-profile-edit'
                          ? 'flex h-8 w-12 items-center justify-start overflow-hidden rounded-md mt-[30px]'
                          : 'flex h-8 w-12 items-center justify-start overflow-hidden rounded-md'
                      }
                    >
                      {currentFileType.startsWith('video/') ? (
                        <video
                          src={URL.createObjectURL(extractedFile)}
                          width={100}
                          height={100}
                          autoPlay
                        />
                      ) : (
                        <Image
                          src={URL.createObjectURL(extractedFile)}
                          width={100}
                          height={100}
                          alt={object.fileNameElement.props}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>
      <div className="mx-auto text-[10px] font-[600] text-red-800">
        {imageValidationErr.msg}
      </div>
      <div
        className={
          page && page === 'vendor-profile-edit'
            ? 'mx-auto sm:w-44'
            : 'mx-auto w-44'
        }
      >
        {/* Error Messages Container  */}

        {/* Rules  */}
        {page === 'vendor-profile-edit' ? (
          <pre className="w-full text-gray-600 text-[14px] text-[#71717A] font-medium mt-[10px] xl:ml-[31px] whitespace-normal lg:whitespace-nowrap">
            <strong>Recommended Size</strong>: {maxFileWidth} x {maxFileHeight}{' '}
            pixel{' '}
            <span className="ml-2 text-[14px] text-[#71717A] font-medium">
              <strong>Upload File Type:</strong>{' '}
              <span className="text-[14px] text-[#71717A] font-normal">
                PNG or JPG
              </span>{' '}
            </span>
            {/* {fileTypes?.map((type, index) => {
            return (
              <pre className="w-full text-xs text-gray-600" key={index}>
                {type.split('')}
              </pre>
            );
          })} */}
          </pre>
        ) : (
          <>
            <pre className="w-full text-xs text-gray-600">
              {`Prefered dimensions ${maxFileWidth} x ${maxFileHeight}`}{' '}
              <span className="text-red-600">*</span>
            </pre>
            <pre className="w-full text-xs text-gray-600">
              {`Prefered File size < ${maxFileSize === 2097152 ? '2MB' : '500KB'}`}
              <span className="text-red-600">*</span>
            </pre>
            <pre className="max-auto flex w-full flex-wrap items-center text-wrap text-xs">
              <strong>Allowed file types:</strong>
              {fileTypes?.map((type, index) => {
                return (
                  <pre className="w-full text-xs text-gray-600" key={index}>
                    {type.split('')}
                  </pre>
                );
              })}
            </pre>
          </>
        )}
      </div>
    </div>
  );
}

export default memo(CustomUploadImageComponent);
