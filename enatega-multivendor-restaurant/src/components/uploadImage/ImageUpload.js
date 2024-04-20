import React, { useState } from 'react';
import { View, Image, Button } from 'react-native';
import ImagePicker from 'react-native-image-picker';

const ImageUpload = () => {
  const [imageUri, setImageUri] = useState(null);

  const handleImageUpload = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.uri;
        setImageUri(uri);
        // Here you would typically send the image URI to your backend for storage
        // and then retrieve the URL of the stored image to display it.
      }
    });
  };

  return (
    <View style={{ alignItems: 'center' }}>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 200, height: 200, marginBottom: 10 }}
        />
      )}
      <Button title="Upload Image" onPress={handleImageUpload} />
    </View>
  );
};

export default ImageUpload;
