import CustomDialog from "@/lib/ui/useable-components/custom-dialog";
import CustomButton from "@/lib/ui/useable-components/button";

interface IPhoneConflictModalProps {
    isVisible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function PhoneConflictModal({
    isVisible,
    onConfirm,
    onCancel,
    isLoading = false,
}: IPhoneConflictModalProps) {

    return (
        <CustomDialog visible={isVisible} onHide={onCancel} width="420px">
            <div className="flex flex-col items-center justify-center p-6 text-center gap-y-4">
                <h3 className="text-xl font-bold dark:text-white">
                    {"Phone number is already associated with another account"}
                </h3>

                <p className="text-gray-600 dark:text-gray-300">
                    {"Are you sure you want to proceed? Continuing will disassociate this phone number from the previous account."}
                </p>

                <div className="flex flex-row gap-4 w-full mt-4 justify-center">
                    <CustomButton
                        label={"Cancel"}
                        className="w-1/2 border border-black dark:border-white text-black dark:text-white bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full h-10"
                        onClick={onCancel}
                    />

                    <CustomButton
                        label={"Confirm"}
                        className="w-1/2 bg-primary-color text-white hover:bg-opacity-90 rounded-full h-10 border-none"
                        onClick={onConfirm}
                        loading={isLoading}
                    />
                </div>
            </div>
        </CustomDialog>
    );
}
