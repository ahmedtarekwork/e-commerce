export default (quantityName: "quantity" | "count" = "quantity") => {
  const quantityProp = quantityName;

  return {
    listCell: [
      "img",
      "title",
      "brand",
      quantityProp,
      "category",
      "price",
      "more info",
    ],

    productCardCells: ["brand", quantityProp, "category", "price"],
  };
};
