// components
import DeleteUserBtn, {
  type DeleteUserBtnProps,
} from "../../components/DeleteUserBtn";

// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// utiles
import axios from "../../utiles/axios";

const deleteUserMutationFn = async (userId: string) => {
  return (await axios.delete("users/" + userId)).data;
};

const useDeleteUserBtn = (userId?: string) => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteUser,
    isError: deleteErr,
    error: deleteErrData,
    isPending: deleteLoading,
    isSuccess: deleteSuccess,
    reset,
    data: deletedUserData,
  } = useMutation({
    mutationKey: ["deleteUser", userId],
    mutationFn: deleteUserMutationFn,
    onSuccess: () => {
      queryClient.prefetchQuery({ queryKey: ["getAllUsers"] });
    },
  });

  return {
    deleteBtn: ({
      itemId: userId,
      username,
      ...attr
    }: Omit<DeleteUserBtnProps, "deleteLoading" | "deleteItem">) => (
      <DeleteUserBtn
        {...attr}
        {...{ deleteLoading, deleteItem: deleteUser, itemId: userId, username }}
      />
    ),

    deletedUserData,
    deleteErr,
    deleteErrData,
    deleteSuccess,
    reset,
  };
};

export default useDeleteUserBtn;
