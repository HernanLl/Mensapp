import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import Input from "./Input";
storiesOf("Input", module)
  .add("text", () => {
    const [value, setValue] = useState();
    return (
      <Input
        icon="USER"
        color="pink"
        type="text"
        value={value}
        onChange={(value) => setValue(value)}
        placeholder="Nombre completo"
      />
    );
  })
  .add("password", () => {
    const [value, setValue] = useState();
    return (
      <Input
        icon="KEY"
        color="#ccc"
        type="password"
        value={value}
        onChange={(value) => setValue(value)}
        placeholder="Contraseña"
      />
    );
  });
