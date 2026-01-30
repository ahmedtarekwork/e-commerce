import { InitStateType } from "../../store/fetures/userSlice";

const userStateMock: InitStateType = {
  user: {
    _id: "1",
    email: "test@test.com",
    username: "test",
    wishlist: [],
    isAdmin: false,
  },

  userCart: null,
  allUsers: [],
  cartLoading: false,
  wishlistLoading: false,
};

export default userStateMock;
