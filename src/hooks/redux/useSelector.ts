import {
  useSelector as ReduxUseSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import { type RootStateType } from "../../utiles/types";

const useSelector: TypedUseSelectorHook<RootStateType> = ReduxUseSelector;
export default useSelector;
