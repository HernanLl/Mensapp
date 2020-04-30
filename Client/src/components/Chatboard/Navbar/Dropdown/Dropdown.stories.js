import React from "react";
import { storiesOf } from "@storybook/react";
import Dropdown from "./Dropdown";
storiesOf("Dropdown", module).add("primary", () => (
  <div style={{ height: "100vh", width: "100vw", display: "flex" }}>
    <Dropdown
      icon="CONFIG"
      background="pink"
      options={["Cerrar sesion", "Borrar cuenta"]}
    />
  </div>
));
