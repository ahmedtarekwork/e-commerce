import { ProductType } from "../../../../utils/types";

export const products: ProductType[] = [
  {
    _id: "1",
    brand: { _id: "1", name: "Brand 1" },
    category: { _id: "1", name: "Category 1" },
    color: "#fff",
    description: "lorem ipusm 1",
    imgs: [
      {
        _id: "1",
        secure_url: "https://picsum.photos/200/300",
        public_id: "1",
      },
    ],
    price: 1000,
    quantity: 11,
    sold: 1,
    title: "Product Title 1",
    ratings: [],
    totalRating: "",
  },
  {
    _id: "2",
    brand: { _id: "2", name: "Brand 2" },
    category: { _id: "2", name: "Category 2" },
    color: "#000",
    description: "lorem ipusm 2",
    imgs: [
      {
        _id: "2",
        secure_url: "https://picsum.photos/200/300",
        public_id: "2",
      },
    ],
    price: 2000,
    quantity: 2,
    sold: 2,
    title: "Product Title 2",
    ratings: [],
    totalRating: "",
  },
  {
    _id: "3",
    brand: { _id: "3", name: "Brand 3" },
    category: { _id: "3", name: "Category 3" },
    color: "#f00",
    description: "lorem ipusm 3",
    imgs: [
      {
        _id: "3",
        secure_url: "https://picsum.photos/200/300",
        public_id: "3",
      },
    ],
    price: 3000,
    quantity: 33,
    sold: 3,
    title: "Product Title 3",
    ratings: [],
    totalRating: "",
  },
];
