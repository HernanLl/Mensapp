import React from "react";
import { storiesOf } from "@storybook/react";
import Message from "./Message";

storiesOf("Message", module)
  .add("other", () => (
    <Message
      my={false}
      datetime="2020-04-23 15:35"
      message="Hola como andas¿?"
      urlprofile="https://scontent.faep9-2.fna.fbcdn.net/v/t31.0-1/p160x160/12484784_980430892031686_4558599259143966728_o.jpg?_nc_cat=106&_nc_sid=dbb9e7&_nc_ohc=WM4mIC1cqDEAX_uIILN&_nc_ht=scontent.faep9-2.fna&_nc_tp=6&oh=9d72cc29e32601acdecd1339535e3ad3&oe=5ED5649C"
    />
  ))
  .add("my", () => (
    <Message
      my={true}
      datetime="2020-04-23 15:35"
      message="Hola como andas¿?"
      urlprofile="https://scontent.faep9-2.fna.fbcdn.net/v/t31.0-1/p160x160/12484784_980430892031686_4558599259143966728_o.jpg?_nc_cat=106&_nc_sid=dbb9e7&_nc_ohc=WM4mIC1cqDEAX_uIILN&_nc_ht=scontent.faep9-2.fna&_nc_tp=6&oh=9d72cc29e32601acdecd1339535e3ad3&oe=5ED5649C"
    />
  ));
