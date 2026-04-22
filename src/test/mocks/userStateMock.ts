import { InitStateType } from "../../store/fetures/userSlice";
import { users } from "./handlers/auth/statics";

const userStateMock: InitStateType = {
  user: users[0],

  userCart: { orderdby: "", products: [], totalItemsLength: 0 },
  cartLoading: false,
  wishlistLoading: false,
};

export default userStateMock;
