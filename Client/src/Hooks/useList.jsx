import React from "react";

function useList(items, ItemComponent) {
  return (
    <div style={{ flex: "1" }}>
      {items.map((i) => (
        <ItemComponent {...i} />
      ))}
    </div>
  );
}

export default useList;
