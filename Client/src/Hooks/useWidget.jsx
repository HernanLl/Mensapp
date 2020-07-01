import { useEffect, useState, useContext } from "react";
import { Context } from "../context/Context";
import { getCookie } from "../helper/helper";

const useWidget = () => {
  const defaultImages = [
    "https://res.cloudinary.com/dqiahaymp/image/upload/v1590419681/profiles/p6p3qwtz9mq135qy0eqe.jpg",
    "https://res.cloudinary.com/dqiahaymp/image/upload/v1590419759/profiles/qsht38i88qnuthkutfhl.jpg",
  ];
  const [images, setImages] = useState(defaultImages);
  const [selectedImage, setSelectedImage] = useState(-1);

  const { socket } = useContext(Context);

  const generateSignature = (cb, params_to_sign) => {
    /*eslint-disable no-undef*/
    const mode = process.env.NODE_ENV;
    /*eslint-enable no-undef*/
    fetch(
      mode === "development"
        ? "http://localhost:3000/generateSignature"
        : "/generateSignature",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ params_to_sign }),
      }
    )
      .then((res) => res.json())
      .then((res) => cb(res));
  };

  useEffect(() => {
    if (selectedImage !== -1) {
      window.cloudinary.openUploadWidget(
        {
          cloudName: "dqiahaymp",
          apiKey: "459277451195346",
          uploadPreset: "goj1jntd",
          uploadSignature: generateSignature,
          multiple: false,
          cropping: true,
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            //update url in database and remove old image
            socket.emit("update and remove", {
              cookie: getCookie(),
              url: images[selectedImage],
              newurl: result.info.url,
              selectedImage,
            });
            let arr = images.slice();
            arr[selectedImage] = result.info.url;
            setImages(arr);
          }
          setSelectedImage(-1);
        }
      );
    }
  }, [selectedImage]);

  return [images, setSelectedImage, setImages, selectedImage];
};

export default useWidget;
