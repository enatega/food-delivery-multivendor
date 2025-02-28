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
import { useTranslations } from 'use-intl';
// import { MAX_VIDEO_FILE_SIZE } from '@/lib/utils/constants';

function CustomUploadImageComponent({
  name,
  title,
  page,
  // onChange,
  onSetImageUrl,
  existingImageUrl,
  style,
  fileTypes = [
    'image/webp',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'video/webm',
    'video/mp4',
  ],
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

  // Hooks
  const t = useTranslations();

  // Filter Files
  const filterFiles = (event: FileUploadSelectEvent): File | undefined => {
    const files = Array.from(event.files || []);
    const extracted_files = files.filter((file) =>
      file.name.match(/\.(jpg|jpeg|png|gif|webp|avif|mp4|webm)$/)
    );
    return extracted_files.length ? extracted_files[0] : files[0];
  };

  // Convert to Base64
  const imageToBase64 = useCallback(
    async (file: File): Promise<void> => {
      var isValid = true;
      setIsUploading(true);
      // if (file?.type.startsWith('video/')) {
      //   isValid = await validateVideo(file);
      // } else {
      //   isValid = await validateImage(file);
      // }
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
                console.log(':rocket: ~ .then ~ url:', url);
                isValid = false;
                console.log(':rocket: ~ Valid url idk about the response');
                onSetImageUrl(name, url);
                if (!url) {
                  showToast({
                    type: 'error',
                    title: title,
                    message: `${fileTypes.includes('video/webm') || fileTypes.includes('video/mp4') ? t('File') : t('Image')} ${t('Upload Failed')}`,
                    duration: 2500,
                  });
                  setImageValidationErr({
                    bool: true,
                    msg: 'Cloudinary Url Invalid',
                  });
                  setImageFile('');
                  return;
                }
                showToast({
                  type: 'info',
                  title: title,
                  message: `${fileTypes.includes('video/webm') || fileTypes.includes('video/mp4') ? t('File') : t('Image')} ${t('has been uploaded successfully')}.`,
                  duration: 2500,
                });
              })
              .catch((err) => {
                onSetImageUrl(name, '');
                showToast({
                  type: 'error',
                  title: title,
                  message: `${fileTypes.includes('video/webm') || fileTypes.includes('video/mp4') ? t('File') : t('Image')} ${t('Upload Failed')}`,
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
      // validateImage,
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
                          {t('Drag & Drop Image Here')}
                        </p>
                      </>
                    )}

                    <div className="flex w-12 flex-col items-center justify-center">
                      <div className="relative my-2 h-12 w-12 overflow-hidden rounded-md">
                        {existingImageUrl ? (
                          existingImageUrl.includes('video/') ? (
                            <video
                              src={existingImageUrl}
                              width={100}
                              height={100}
                              autoPlay
                              muted
                            />
                          ) : (
                            <Image
                              alt="User avatar"
                              src={existingImageUrl}
                              width={100}
                              height={100}
                            />
                          )
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
          chooseLabel={t('Upload Image')}
          chooseOptions={
            page === 'vendor-profile-edit'
              ? {
                  className: `z-50 bg-white max-[500px]:ml-[-20px] ${!imageFile ? 'text-gray-700' : imageValidationErr.bool && !imageFile ? 'text-[#E4E4E7]' : 'text-[#E4E4E7]'} border border-[#E4E4E7] rounded-md items-center justify-center relative left-[20%] translate-y-[45px] w-[173px] h-[40px] text-[14px] gap-[5px] font-medium`,
                  label: t('Upload Image'),
                  icon: () => <FontAwesomeIcon icon={faArrowUpFromBracket} />,
                }
              : {
                  className: `z-50 bg-gray-200 ${!imageFile ? 'text-gray-700' : imageValidationErr.bool && !imageFile ? 'text-red-900' : 'text-gray-700'} border border-gray-500 rounded-md items-center justify-center relative left-[20%] translate-y-[45px] w-32 h-8 text-xs`,
                  label: t('Browse Files'),
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
                          muted
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
    </div>
  );
}

export default memo(CustomUploadImageComponent);
