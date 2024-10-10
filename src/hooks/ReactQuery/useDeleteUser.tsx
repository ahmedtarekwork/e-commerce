// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// redux
import useSelector from "../redux/useSelector";

// hooks
import useLogoutUser from "../useLogoutUser";
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
  onError?: (error: unknown) => void
) => {
  // hooks
  const { logoutUser } = useLogoutUser();
  const handleError = useHandleErrorMsg();

  // redux
  const { user } = useSelector((state) => state.user);
  const showMsg = useShowMsg();

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
      } else {
        await logoutUser();
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
