'use client';

import {
  faAdd,
  faEdit,
  faEllipsisVertical,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useRef } from 'react';
import BreakdownForm from './forms/breakdown.form';
import { useLoyaltyContext } from '@/lib/hooks/useLoyalty';
import {
  FetchLoyaltyBreakdownsDocument,
  useDeleteLoyaltyBreakdownMutation,
  useFetchLoyaltyBreakdownsQuery,
} from '@/lib/graphql-generated';
import { ProgressSpinner } from 'primereact/progressspinner';
import useToast from '@/lib/hooks/useToast';
import NoData from '@/lib/ui/useable-components/no-data';
import DataTableColumnSkeleton from '@/lib/ui/useable-components/custom-skeletons/datatable.column.skeleton';
import { useConfiguration } from '@/lib/hooks/useConfiguration';


export default function LoyaltyAndReferralBreakdownSectionComponent() {
  const { breakdownFormVisible, setBreakdownFormVisible, setLoyaltyData } =
    useLoyaltyContext();
  const { showToast } = useToast();
  const {CURRENCY_SYMBOL} = useConfiguration()

  // States
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // API
  const { data, loading } = useFetchLoyaltyBreakdownsQuery();
  const [deleteLoyaltyBreakdown, { loading: deletingBreakdown }] =
    useDeleteLoyaltyBreakdownMutation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      setOpenMenu(null);
      await deleteLoyaltyBreakdown({
        variables: {
          id,
        },
        refetchQueries: [
          {
            query: FetchLoyaltyBreakdownsDocument,
          },
        ],
      });

      showToast({
        type: 'success',
        title: 'Delete Breakdown',
        message: 'Breakdown has been deleted successfully.',
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Failed.',
        message: (err as Error)?.message || 'Please try again later',
      });
    } finally {
      setDeletingId('');
    }
  };

  return (
    <>
      <div className="m-3 p-6 border border-border rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              Customer Loyalty Points Breakdown
            </h2>
            <p className="text-muted-foreground text-sm">
              See how spending translates into reward points.
            </p>
          </div>
          <button
            className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            onClick={() => setBreakdownFormVisible(true)}
          >
            <FontAwesomeIcon icon={faAdd} /> Add Breakdown
          </button>
        </div>

        <div
          className="bg-card dark:bg-dark-900 border border-border dark:border-dark-600 rounded-lg overflow-visible"
          ref={menuRef}
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-border dark:border-dark-600 bg-[#F4F4F5] dark:bg-dark-600">
                <th className="text-[#71717A] dark:text-gray-300 text-left px-6 py-4 text-foreground font-inter font-medium text-sm leading-5 tracking-normal">
                  Spending Range ({CURRENCY_SYMBOL})
                </th>
                <th className="text-[#71717A] dark:text-gray-300 text-left px-6 py-4 text-foreground font-inter font-medium text-sm leading-5 tracking-normal">
                  Bronze Pts
                </th>
                <th className="text-[#71717A] dark:text-gray-300 text-left px-6 py-4 text-foreground font-inter font-medium text-sm leading-5 tracking-normal">
                  Silver Pts
                </th>
                <th className="text-[#71717A] dark:text-gray-300 text-left px-6 py-4 text-foreground font-inter font-medium text-sm leading-5 tracking-normal">
                  Gold Pts
                </th>
                <th className="text-[#71717A] dark:text-gray-300 text-left px-6 py-4 text-foreground font-inter font-medium text-sm leading-5 tracking-normal">
                  Platinum Pts
                </th>
                <th className="text-right px-6 py-4 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  {new Array(5).fill(0).map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-foreground text-sm font-medium">
                        <DataTableColumnSkeleton key={index} />
                      </td>

                   
                      <td className="px-6 py-4 text-foreground text-sm">
                        <DataTableColumnSkeleton key={index} />
                      </td>
                      <td className="px-6 py-4 text-foreground text-sm font-medium">
                        <DataTableColumnSkeleton key={index} />
                      </td>
                      <td className="px-6 py-4 text-foreground text-sm font-medium">
                        <DataTableColumnSkeleton key={index} />
                      </td>
                      <td className="px-6 py-4 text-foreground text-sm font-medium">
                        <DataTableColumnSkeleton key={index} />
                      </td>
                      <td className="px-6 py-4 text-foreground text-sm font-medium">
                        <DataTableColumnSkeleton key={index} />
                      </td>
                    </tr>
                  ))}
                </>
              ) : !data?.fetchLoyaltyBreakdowns ||
                data?.fetchLoyaltyBreakdowns?.length === 0 ? (
                <NoData />
              ) : (
                data?.fetchLoyaltyBreakdowns?.map((row, index) => {
                  if (!row) return;
                  return (
                    <tr
                      key={row._id}
                      className={
                        index !==
                        (data?.fetchLoyaltyBreakdowns?.length || 0) - 1
                          ? 'border-b border-border'
                          : ''
                      }
                    >
                      <td className="px-6 py-4 text-foreground dark:text-white text-sm">
                        {CURRENCY_SYMBOL}{row.min} - {CURRENCY_SYMBOL}{row.max}
                      </td>
                   
                      <td className="px-6 py-4 text-foreground dark:text-white text-sm font-medium">
                        {row.bronze}
                      </td>
                      <td className="px-6 py-4 text-foreground dark:text-white text-sm font-medium">
                        {row.silver}
                      </td>
                      <td className="px-6 py-4 text-foreground dark:text-white text-sm font-medium">
                        {row.gold}
                      </td>
                      <td className="px-6 py-4 text-foreground dark:text-white text-sm font-medium">
                        {row.platinum}
                      </td>

                      <td className="px-6 py-4 text-right relative">
                        {loading && row?._id === deletingId ? (
                          <ProgressSpinner
                            className="m-0 h-6 w-6 items-center self-center p-0"
                            strokeWidth="5"
                            style={{ fill: 'white', accentColor: 'white' }}
                            color="white"
                          />
                        ) : (
                          <button
                            onClick={() => {
                              setOpenMenu(
                                openMenu === row._id ? null : row._id
                              );
                            }}
                            disabled={deletingBreakdown && row?._id === deletingId}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                          </button>
                        )}

                        {openMenu === row._id && (
                          <div className="absolute top-12 right-0 mt-1 w-40 bg-white dark:bg-dark-900 border border-border dark:border-dark-600 rounded-lg shadow-lg z-50">
                            <button
                              className="w-full text-left px-4 py-2 flex items-center gap-2 text-sm bg-white dark:bg-dark-900 text-foreground dark:text-white hover:bg-gray-50 dark:hover:bg-dark-600"
                              onClick={() => {
                                setOpenMenu(null);
                                setLoyaltyData({ breakdownId: row?._id });
                                setBreakdownFormVisible(true);
                              }}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(row._id)}
                              className="w-full text-left px-4 py-2 flex items-center gap-2 bg-white dark:bg-dark-900 text-sm text-destructive border-t border-border dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-600"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {breakdownFormVisible && <BreakdownForm />}
    </>
  );
}
