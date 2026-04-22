export default (quantityName: "quantity" | "count" = "quantity") => {
  return {
    listCell: [
      "img",
      "title",
      "brand",
      quantityName,
      "category",
      "price",
      "more info",
    ],

    productCardCells: ["brand", quantityName, "category", "price"],
  };
};
