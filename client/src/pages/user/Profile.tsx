import { useEffect } from "react";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import useModal from "@/hooks/shared/useModal";
import { useUserStore } from "@/stores/user.store";
import DeleteModal from "@/components/shared/DeleteModal";
import { useDeleteUser } from "@/hooks/shared/useUserActions";
import { useGetUserById } from "@/hooks/shared/useUserActions";
import EditAvatarModal from "@/components/shared/EditAvatarModal";
import ProfileComponent from "@/components/user/ProfileComponent";

export default function Profile() {
    const { user, setUser } = useUserStore();
    const { isShowing: isDeleteShowing, toggle: toggleDeleteShowing } = useModal();
    const { isShowing: isEditAvatarShowing, toggle: toggleEditAvatarShowing } = useModal();
    const deleteUserAction = useDeleteUser();

    if (!user)
        return (
            <>
                <h1>Loading...</h1>
            </>
        );

    const userState = useGetUserById(user?._id);

    const deleteAction = async () => {
        await deleteUserAction.mutateAsync(user._id);

        toast.success("Account deleted successfully", {
            toastId: "delete-account-success",
            onClose: () => {
                window.location.href = "/auth/login";
            },
        });
    };

    const onError = (err: any) => {
        let message = "Failed to delete account";
        if (isAxiosError(err)) {
            if (err.status === 403) {
                toast.error("You are not authorized to perform this action", {
                    toastId: "delete-account-error",
                });
                return;
            }

            const responseData = err.response?.data;
            message = responseData?.error[0]?.message || responseData?.message || err.message || message;
        }

        toast.error(message, {
            toastId: "delete-account-error",
        });
    };

    useEffect(() => {
        if (userState.data) setUser(userState.data);
    }, [userState.data]);

    const userData = userState.data;
    if (!userData)
        return (
            <>
                <h1>Loading...</h1>
            </>
        );

    return (
        <div className="flex-1">
            <EditAvatarModal
                userId={userData._id}
                isShowing={isEditAvatarShowing}
                hide={toggleEditAvatarShowing}
                refetch={userState.refetch}
            />
            <DeleteModal
                id={userData._id}
                hide={toggleDeleteShowing}
                isShowing={isDeleteShowing}
                confirmText={userData.name}
                deleteAction={deleteAction}
                onError={onError}
            />
            <ProfileComponent
                refetch={userState.refetch}
                toggleEditAvatarModal={toggleEditAvatarShowing}
                toggleDeleteModal={toggleDeleteShowing}
            />
        </div>
    );
}
