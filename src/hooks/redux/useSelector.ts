import {
  useSelector as ReduxUseSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import { type RootStateType } from "../../utils/types";

const useSelector: TypedUseSelectorHook<RootStateType> = ReduxUseSelector;
export default useSelector;
