import React, { useRef, useState } from 'react';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { IUserResponse } from '@/lib/utils/interfaces';
import { CustomDialog } from '@/lib/ui/useable-components/custom-dialog';
import { useMutation } from '@apollo/client';
import { UPDATE_USER_STATUS, UPDATE_USER_NOTES, DELETE_USER, RESET_USER_SESSION } from '@/lib/api/graphql/mutations/user';
import useToast from '@/lib/hooks/useToast';

// TODO: Setup useTranslation hook to get t function for i18n
const t = (key: string,) => key;

type ModalType = 'block' | 'unblock' | 'delete' | 'deactivate' | 'activate' | 'reset' | 'notes' | null;

interface ActionMenuProps {
    rowData: IUserResponse;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ rowData }) => {
    const menuRef = useRef<Menu | null>(null);

    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [internalNote, setInternalNote] = useState(rowData?.notes);

    const { showToast } = useToast();

    const [updateUserStatus, { loading: updateUserStatusLoading }] = useMutation(UPDATE_USER_STATUS, {
        onCompleted: (data) => {
            showToast({ type: 'success', title: 'Success', message: `User status updated to ${data.updateUserStatus.status}` });
            setActiveModal(null);
        },
        onError: (error) => {
            showToast({ type: 'error', title: 'Error', message: error.message || 'Failed to update user status' });
        },
        refetchQueries: ['users']
    });

    const [updateUserNotes, { loading: updateUserNotesLoading }] = useMutation(UPDATE_USER_NOTES, {
        onCompleted: () => {
            showToast({ type: 'success', title: 'Success', message: 'User notes updated successfully' });
            setActiveModal(null);
            setInternalNote('');
        },
        onError: (error) => {
            showToast({ type: 'error', title: 'Error', message: error.message || 'Failed to update user notes' });
        },
        refetchQueries: ['users']// Refetch users after notes update
    });

    const [deleteUser, { loading: deleteUserLoading }] = useMutation(DELETE_USER, {
        onCompleted: () => {
            showToast({ type: 'success', title: 'Success', message: 'User deleted successfully' });
            setActiveModal(null);
        },
        onError: (error) => {
            showToast({ type: 'error', title: 'Error', message: error.message || 'Failed to delete user' });
        },
        refetchQueries: ['users'] // Refetch users after deletion
    });

    const [resetUserSession, { loading: resetUserSessionLoading }] = useMutation(RESET_USER_SESSION, {
        onCompleted: () => {
            showToast({ type: 'success', title: 'Success', message: 'User session reset successfully' });
            setActiveModal(null);
        },
        onError: (error) => {
            showToast({ type: 'error', title: 'Error', message: error.message || 'Failed to reset user session' });
        },
    });

    const handleUpdateStatus = (status: string) => {
        updateUserStatus({ variables: { id: rowData._id, status } });
    };

    const onConfirmBlock = () => handleUpdateStatus('blocked');
    const onConfirmUnblock = () => handleUpdateStatus('active');
    const onConfirmDeactivate = () => handleUpdateStatus('deactivate');
    const onConfirmActivate = () => handleUpdateStatus('active');

    const onConfirmInternalNotes = () => {
        updateUserNotes({ variables: { id: rowData._id, notes: internalNote } });
    };

    const onConfirmDelete = () => {
        deleteUser({ variables: { id: rowData._id } });
    };

    const onConfirmResetSession = () => {
        resetUserSession({ variables: { userId: rowData._id } });
    };

    const items = [];

    if (rowData.status === "deactivate" || rowData.status === "blocked") {
        items.push({
            label: t('Activate Account'),
            icon: 'pi pi-user-plus',
            command: () => setActiveModal('activate'),
        });
    } else {
        items.push({

            label: t('Deactivate Account'),
            icon: 'pi pi-user-minus',
            command: () => setActiveModal('deactivate'),
        }, {
            label: t('Block User'),
            icon: 'pi pi-ban',
            command: () => setActiveModal('block'),
        },);

    }

    items.push(
        {
            label: t('Reset Session'),
            icon: 'pi pi-refresh',
            command: () => setActiveModal('reset'),
        },
        {
            label: t('Internal Notes'),
            icon: 'pi pi-file-edit',
            command: () => setActiveModal('notes'),
        },
        {
            separator: true,
        },
        {
            label: t('Delete Account'),
            icon: 'pi pi-trash',
            className: '!text-red-500',
            command: () => setActiveModal('delete'),
        }
    );


    return (
        <div className="flex justify-end items-center relative" onClick={(e) => e.stopPropagation()}>
            <Menu model={items} popup ref={menuRef} className="min-w-[150px]" />

            <Button
                icon="pi pi-ellipsis-v"
                text
                rounded
                aria-label="Actions"
                className="p-2 rounded-md border hover:bg-muted/30 transition-all"
                onClick={(event) => menuRef.current?.toggle(event)}
            />

            {/* Dialogs for actions */}
            <CustomDialog
                visible={activeModal === 'block'}
                onHide={() => setActiveModal(null)}
                onConfirm={onConfirmBlock}
                title={t('Block User Confirmation')}
                message={t('Are you sure you want to block this user?')}
                loading={updateUserStatusLoading}
                buttonConfig={{
                    primaryButtonProp: { label: t('Yes, block'), className: 'p-button-warning p-3 !px-5 rounded-md  bg-red-500 text-white  ' },
                    secondaryButtonProp: { label: t('Cancel'), className: 'p-button-warning p-3 rounded-md  bg-gray-500 text-white  me-5' },
                }}
            />

            <CustomDialog
                visible={activeModal === 'unblock'}
                onHide={() => setActiveModal(null)}
                onConfirm={onConfirmUnblock}
                title={t('Unblock User Confirmation')}
                message={t('Are you sure you want to unblock this user?')}
                loading={updateUserStatusLoading}
                buttonConfig={{
                    primaryButtonProp: { label: t('Yes, unblock'), className: 'p-button-warning p-3 !px-5 rounded-md  bg-primary-color text-white  ' },
                    secondaryButtonProp: { label: t('Cancel'), className: 'p-button-warning p-3 rounded-md  bg-gray-500 text-white  me-5' },
                }}
            />

            <CustomDialog
                visible={activeModal === 'deactivate'}
                onHide={() => setActiveModal(null)}
                onConfirm={onConfirmDeactivate}
                title={t('Deactivate Account Confirmation')}
                message={t('Are you sure you want to deactivate this account? This action is reversible.')}
                loading={updateUserStatusLoading}
                buttonConfig={{
                    primaryButtonProp: { label: t('Yes, deactivate'), className: 'p-button-warning p-3 !px-5 rounded-md  bg-red-500 text-white  ' },
                    secondaryButtonProp: { label: t('Cancel'), className: 'p-button-warning p-3 rounded-md  bg-gray-500 text-white  me-5' },
                }}
            />

            <CustomDialog
                visible={activeModal === 'activate'}
                onHide={() => setActiveModal(null)}
                onConfirm={onConfirmActivate}
                title={t('Activate Account Confirmation')}
                message={t('Are you sure you want to activate this account?')}
                loading={updateUserStatusLoading}
                buttonConfig={{
                    primaryButtonProp: { label: t('Yes, activate'), className: 'p-button-warning p-3 !px-5 rounded-md  bg-primary-color text-white  ' },
                    secondaryButtonProp: { label: t('Cancel'), className: 'p-button-warning p-3 rounded-md  bg-gray-500 text-white  me-5' },
                }}
            />

            <CustomDialog
                visible={activeModal === 'delete'}
                onHide={() => setActiveModal(null)}
                onConfirm={onConfirmDelete}
                title={t('Delete Account Confirmation')}
                message={t('Are you sure you want to permanently delete this account? This action cannot be undone.')}
                loading={deleteUserLoading}
                buttonConfig={{
                    primaryButtonProp: { label: t('Yes, delete'), className: 'p-button-warning p-3 !px-5 rounded-md  bg-red-500 text-white  ' },
                    secondaryButtonProp: { label: t('Cancel'), className: 'p-button-warning p-3 rounded-md  bg-gray-500 text-white  me-5' },
                }}
            />

            <CustomDialog
                visible={activeModal === 'reset'}
                onHide={() => setActiveModal(null)}
                onConfirm={onConfirmResetSession}
                title={t('Reset Session Confirmation')}
                message={t('Are you sure you want to log this user out from all devices?')}
                loading={resetUserSessionLoading} // No mutation yet
                buttonConfig={{
                    primaryButtonProp: { label: t('Yes, reset'), className: 'p-button-warning p-3 !px-5 rounded-md  bg-red-500 text-white  ' },
                    secondaryButtonProp: { label: t('Cancel'), className: 'p-button-warning p-3 rounded-md  bg-gray-500 text-white  me-5' },
                }}
            />

            <CustomDialog
                visible={activeModal === 'notes'}
                onHide={() => setActiveModal(null)}
                onConfirm={onConfirmInternalNotes}
                title={t('Internal Notes')}
                loading={updateUserNotesLoading}
                buttonConfig={{
                    primaryButtonProp: { label: t('Save'), className: 'p-button-warning p-3 !px-5 rounded-md  bg-primary-color text-white  ' },
                    secondaryButtonProp: { label: t('Cancel'), className: 'p-button-warning p-3 rounded-md  bg-gray-500 text-white  me-5' },
                }}
            >
                <div className="">
                    <InputTextarea
                        value={internalNote}
                        onChange={(e) => setInternalNote(e.target.value)}
                        rows={5}
                        className="w-full p-4 border rounded-lg shadow-sm"
                        placeholder={t('Add internal notes here...')}
                    />
                </div>
            </CustomDialog>
        </div>
    );
};