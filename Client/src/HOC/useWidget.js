import React, { useEffect, useState, useContext } from "react";
import { Context } from "../context/Context";
import Cookie from "js-cookie";
import { getCookie } from "../helper/helper";

export default function useWidget(WrappedComponent) {
  return (props) => {
    const defaultImages = [
      "https://res.cloudinary.com/dqiahaymp/image/upload/v1589148304/i1mtxj9nfxk0s29pmmrl.jpg",
      "https://res.cloudinary.com/dqiahaymp/image/upload/v1588340109/lxgcj1sbngdfpiqwxdzc.jpg",
    ];
    const [images, setImages] = useState(defaultImages);
    const [selectedImage, setSelectedImage] = useState(-1);

    const { socket } = useContext(Context);

    const generateSignature = (cb, params_to_sign) => {
      const { token, refreshToken, id } = getCookie();
      fetch("http://localhost:3000/generateSignature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ params_to_sign, token, refreshToken, id }),
      })
        .then((res) => res.json())
        .then((res) => cb(res));
    };

    useEffect(() => {
      if (selectedImage !== -1) {
        cloudinary.openUploadWidget(
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
              const { token, refreshToken, id } = JSON.parse(
                Cookie.get("Auth")
              );
              //update url in database and remove old image
              socket.emit("update and remove", {
                token,
                refreshToken,
                id,
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

    return (
      <WrappedComponent
        {...props}
        images={images}
        setImages={setImages}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
    );
  };
}
