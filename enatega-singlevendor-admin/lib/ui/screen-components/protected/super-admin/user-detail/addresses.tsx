"use client";
import React from 'react';
import { Tag } from 'primereact/tag';
import { IAddress } from '@/lib/utils/interfaces/users.interface';
import { Card } from 'primereact/card';
import { useTranslations } from 'next-intl'

interface AddressesProps {
  addresses: IAddress[];
}

const Addresses: React.FC<AddressesProps> = ({ addresses }) => {
  const t = useTranslations();
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {addresses.map((addr, index) => (
        <Card
          key={index}
          className="shadow-sm border border-gray-100 rounded-lg"
          title={
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">{t(addr.label)}</span>
              {addr.selected && <Tag value="Default" severity="success" />}
            </div>
          }
        >
          <p className="text-gray-700">{addr.deliveryAddress}</p>
          <p className="text-gray-700 text-sm">{addr.details}</p>
        </Card>
      ))}
    </div>
  );
};

export default Addresses;