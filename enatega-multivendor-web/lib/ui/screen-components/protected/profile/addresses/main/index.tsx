"use client";

import { useCallback, useEffect, useRef, useState } from "react";
// Queries- Mutations
import { DELETE_ADDRESS } from "@/lib/api/graphql/mutations";
import { useMutation, useQuery } from "@apollo/client";
//Hooks
import useToast from "@/lib/hooks/useToast";

// Components
import UserAddressComponent from "@/lib/ui/useable-components/address";
import CustomIconButton from "@/lib/ui/useable-components/custom-icon-button";
import AddressesSkeleton from "@/lib/ui/useable-components/custom-skeletons/addresses.skelton";
import CustomDialog from "@/lib/ui/useable-components/delete-dialog";
import EmptyAddress from "@/lib/ui/useable-components/empty-address";
import AddressItem from "../main/address-listings";

//Interfaces
import { ISingleAddress } from "@/lib/utils/interfaces/profile.interface";

import { IUserAddress } from "@/lib/utils/interfaces";
//Icons
import { GET_USER_PROFILE } from "@/lib/api/graphql";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function AddressesMain() {
  // states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isUserAddressModalOpen, setIsUserAddressModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<IUserAddress | null>(null);

  // Hooks
  const { showToast } = useToast();

  //Queries and Mutations
  const { data: profileData, loading: profileLoading } = useQuery(
    GET_USER_PROFILE,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const [
    mutate,
    { loading: loadingAddressMutation, error: deleteAddressError },
  ] = useMutation(DELETE_ADDRESS, {
    onCompleted,
  });

  function onCompleted() {
    showToast({
      type: "success",
      title: "Address",
      message: "Deleted Successfully",
      duration: 3000,
    });
    setDeleteTarget(null);
  }

  // variables
  const addresses = profileData?.profile?.addresses || [];
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Handlers

  // Handle Toggle Dropdown
  // This function toggles the dropdown menu for a specific address.
  const toggleDropdown = useCallback((addressId: string) => {
    setActiveDropdown((prev) => (prev === addressId ? null : addressId));
  }, []);

  // Handle Delete Address
  // This function sets the target address ID for deletion.
  const handleDeleteAddress = useCallback((addressId: string) => {
    setDeleteTarget(addressId);
  }, []);

  // Handle Confirm Delete
  // This function confirms the deletion of the address.
  // It calls the mutation to delete the address and resets the target.
  const handleConfirmDelete = useCallback(async () => {
    if (deleteTarget) {
      await mutate({ variables: { id: deleteTarget } });
      setDeleteTarget(null);
    }
  }, [deleteTarget]);

  const onEditAddress = (address: IUserAddress | null) => {
    setEditAddress(address);
    setIsUserAddressModalOpen(!!address);
  };

  // UseEffects
  // Handle Address Deletion Error
  // This effect shows a toast notification if there is an error deleting the address.
  useEffect(() => {
    if (deleteAddressError) {
      showToast({
        type: "error",
        title: "Address",
        message: "Failed to delete",
        duration: 3000,
      });
    }
  }, [deleteAddressError]);

  // Handle Click Outside Dropdown
  // This effect closes the dropdown menu if a click is detected outside of it.
  // It uses a ref to check if the click target is outside of the dropdown.
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const handleClickOutside = (event: MouseEvent) => {
      const isOutside = addresses.every((address: ISingleAddress) => {
        const ref = dropdownRefs.current[address?._id];
        return !ref || !ref.contains(event.target as Node);
      });

      if (isOutside) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [addresses]);

  // Return Skelton on Loading state
  if (profileLoading) return <AddressesSkeleton />;

  return (
    <>
      <div className="w-full mx-auto">
        <CustomDialog
          onConfirm={handleConfirmDelete}
          onHide={() => setDeleteTarget(null)}
          visible={!!deleteTarget}
          loading={loadingAddressMutation}
        />
        {addresses?.map((address: IUserAddress) => (
          <AddressItem
            key={address?._id}
            address={address}
            activeDropdown={activeDropdown}
            toggleDropdown={toggleDropdown}
            handleDelete={handleDeleteAddress}
            setDropdownRef={(id) => (el) => (dropdownRefs.current[id] = el)}
            onEditAddress={onEditAddress}
          />
        ))}
        {!addresses.length && <EmptyAddress />}

        <div className="flex justify-center mt-16">
          <CustomIconButton
            title="Add New Address"
            iconColor="black"
            classNames="bg-[#5AC12F] w-[content] px-4"
            Icon={faPlus}
            loading={false}
            handleClick={() => {
              setIsUserAddressModalOpen(true);
            }}
          />
        </div>
      </div>

      <UserAddressComponent
        editAddress={editAddress}
        visible={isUserAddressModalOpen}
        onHide={() => setIsUserAddressModalOpen(false)}
      />
    </>
  );
}
