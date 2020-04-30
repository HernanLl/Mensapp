import React from "react";
import { storiesOf } from "@storybook/react";
import Icon from "./Icon";

storiesOf("Icon", module).add("primary", () => (
  <Icon name="CONFIG" size={50} color="pink" pointer={true} />
));
