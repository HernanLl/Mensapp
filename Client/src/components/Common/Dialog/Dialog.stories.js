import React from "react";
import { storiesOf } from "@storybook/react";
import Dialog from "./Dialog";

storiesOf("Dialog", module)
  .add("success", () => (
    <Dialog
      type="success"
      title="Registrado exitosamente"
      description=""
      display={true}
      onClose={() => alert("close")}
      onSuccess={() => alert("success")}
    />
  ))
  .add("danger", () => (
    <Dialog
      type="danger"
      options={true}
      title="¿Esta seguro?"
      description="Luego de borrada, no se podra recuperar"
      display={true}
      onClose={() => alert("close")}
      onSuccess={() => alert("success")}
    />
  ))
  .add("info", () => (
    <Dialog
      type="info"
      title="Aplicacion actualizada"
      description="Disfrute de las nuevas funcionalidades"
      display={true}
      onClose={() => alert("close")}
      onSuccess={() => alert("success")}
    />
  ));
