import React from "react";

function useList(items, ItemComponent, onClick) {
  console.log(items);
  return (
    <div style={{ width: "100%" }}>
      {items &&
        items.map((elem, index) => (
          <ItemComponent
            key={elem.id ? elem.id : index}
            {...elem}
            onClick={onClick}
          />
        ))}
    </div>
  );
}

export default useList;
