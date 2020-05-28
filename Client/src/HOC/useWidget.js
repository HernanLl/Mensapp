import React, { useEffect, useState, useContext } from "react";
import { Context } from "../context/Context";
import Cookie from "js-cookie";
import { getCookie } from "../helper/helper";

export default function useWidget(WrappedComponent) {
  return (props) => {
    const defaultImages = [
      "https://res.cloudinary.com/dqiahaymp/image/upload/v1590419681/profiles/p6p3qwtz9mq135qy0eqe.jpg",
      "https://res.cloudinary.com/dqiahaymp/image/upload/v1590419759/profiles/qsht38i88qnuthkutfhl.jpg",
    ];
    const [images, setImages] = useState(defaultImages);
    const [selectedImage, setSelectedImage] = useState(-1);

    const { socket } = useContext(Context);

    const generateSignature = (cb, params_to_sign) => {
      fetch("http://localhost:3000/generateSignature", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ params_to_sign }),
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
