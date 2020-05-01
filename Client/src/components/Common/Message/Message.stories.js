import React from "react";
import { storiesOf } from "@storybook/react";
import Message from "./Message";

storiesOf("Message", module)
  .add("other", () => <Message my={false} />)
  .add("my", () => <Message my={true} />);
