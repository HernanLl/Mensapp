import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import Textarea from "./Textarea";

storiesOf("Textarea", module).add("primary", () => {
  const [value, setValue] = useState("");
  return (
    <Textarea
      width="50%"
      height="100px"
      color="pink"
      value={value}
      onChange={(value) => setValue(value)}
      placeholder="Estado"
    />
  );
});
