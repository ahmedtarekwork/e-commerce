import type { UserType } from "../../../../utils/types";

export const users: (UserType & { password: string })[] = [
  {
    _id: "1",
    email: "1@mail.com",
    isAdmin: false,
    username: "one",
    password: "password1",
    wishlist: [],
  },
  {
    _id: "2",
    email: "2@mail.com",
    isAdmin: false,
    username: "two",
    password: "password2",
    wishlist: [],
  },
];
