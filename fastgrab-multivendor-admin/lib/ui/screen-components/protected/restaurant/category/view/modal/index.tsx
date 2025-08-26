// GraphQL
import { GET_SUBCATEGORIES_BY_PARENT_ID } from '@/lib/api/graphql/queries/sub-categories';

// Components
import InputSkeleton from '@/lib/ui/useable-components/custom-skeletons/inputfield.skeleton';

// Interfaces
import {
  ISubCategoriesPreviewModalProps,
  ISubCategoryByParentIdResponse,
} from '@/lib/utils/interfaces';

// Hooks
import { QueryResult, useQuery } from '@apollo/client';
import { useTranslations } from 'next-intl';

// Prime React
import { Dialog } from 'primereact/dialog';

export default function SubCategoriesPreiwModal({
  subCategoryParentId,
  isSubCategoryModalOpen,
  setIsSubCategoryModalOpen,
}: ISubCategoriesPreviewModalProps) {
  // Hooks
  const t = useTranslations();

  // Queries
  const { data: sub_categories_data, loading: sub_categories_loading } =
    useQuery(GET_SUBCATEGORIES_BY_PARENT_ID, {
      variables: {
        parentCategoryId: subCategoryParentId,
      },
    }) as QueryResult<
      ISubCategoryByParentIdResponse | undefined,
      { parentCategoryId: string }
    >;
  return (
    <Dialog
      visible={isSubCategoryModalOpen}
      onHide={() => {
        setIsSubCategoryModalOpen(false);
      }}
      className="p-3 w-1/3 mx-auto"
      header={() => {
        return (
          <div className="mx-auto font-bold text-gray-700">
            {t('Child Categories')}
          </div>
        );
      }}
    >
      <ol className="my-auto">
        {sub_categories_loading ? (
          <InputSkeleton />
        ) : !sub_categories_data?.subCategoriesByParentId?.length ? (
          <li className="my-1 font-semibold text-red-600">
            {t('No sub-categories to show')}
          </li>
        ) : (
          sub_categories_data?.subCategoriesByParentId?.map((sub_ctg) => {
            return (
              <li
                key={sub_ctg._id}
                className="my-1 text-sm font-semibold text-green-500"
              >
                {sub_ctg.title}
              </li>
            );
          })
        )}
      </ol>
    </Dialog>
  );
}
