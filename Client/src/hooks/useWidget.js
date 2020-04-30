import React, { useEffect, useState } from "react";
export default function useWidget(defaultImages) {
  const [selectedImage, setSelectedImage] = useState(-1);
  const [images, setImages] = useState(defaultImages);

  useEffect(() => {
    if (selectedImage !== -1) {
      cloudinary.openUploadWidget(
        {
          cloudName: "dqiahaymp",
          uploadPreset: "v9eo7onv",
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            if (images[selectedImage] !== defaultImages(selectedImage)) {
              //borrar imagen - emito evento mediante el socket enviando la url de la imagen
            }
            let arr = images;
            arr[selectedImage] = result.info.url;
            setImages(arr);
            setSelectedImage(-1);
          }
        }
      );
    }
  }, [selectedImage]);

  return { selectedImage, setSelectedImage, images };
}
