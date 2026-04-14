// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// react router dom
import { useNavigate } from "react-router-dom";

// redux
import useSelector from "../redux/useSelector";
import useDispatch from "../redux/useDispatch";

// redux actions
import { logoutUser } from "../../store/fetures/userSlice";

// hooks
import useHandleErrorMsg from "../useHandleErrorMsg";
import useShowMsg from "../useShowMsg";

// utils
import axios from "../../utils/axios";

// fetchers
const deleteUserMutationFn = async (userId: string) => {
  return (await axios.delete(`users/${userId}`)).data;
};

const useDeleteUser = (
  onSuccess?: (data: { message: string }) => void,
  onError?: (error: unknown) => void,
) => {
  // hooks
  const navigate = useNavigate();
  const handleError = useHandleErrorMsg();
  const showMsg = useShowMsg();

  // redux
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const currentUser = (userId: string) => userId === user?._id;

  const queryClient = useQueryClient();

  const deleteUserMutateHook = useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: deleteUserMutationFn,
    onSuccess: async (data, userId) => {
      if (!currentUser(userId)) {
        showMsg?.({
          content:
            "message" in data ? data.message : "user deleted successfully",
          time: 3500,
          clr: "green",
        });
        navigate("/dashboard/users", { relative: "path" });
      } else {
        dispatch(logoutUser());
        navigate("/login", { relative: "path" });
      }

      deleteUserMutateHook.reset();

      queryClient.prefetchQuery({ queryKey: ["getAllUsers"] });

      onSuccess?.(data);
    },
    onError(error, userId) {
      handleError(error, {
        forAllStates: `something went wrong while ${
          currentUser(userId) ? "remove your account" : "deleting the user"
        }`,
      });

      onError?.(error);
    },
  });

  return deleteUserMutateHook;
};

export default useDeleteUser;
