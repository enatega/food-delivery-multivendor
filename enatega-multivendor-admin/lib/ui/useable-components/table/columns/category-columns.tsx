import { IActionMenuProps, ICategory, ISubCategory, IQueryResult, ISubCategoryByParentIdResponse } from '@/lib/utils/interfaces';
import ActionMenu from '../../action-menu';
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import TextIconClickable from '../../text-icon-clickable';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import { GET_SUBCATEGORIES_BY_PARENT_ID } from '@/lib/api/graphql/queries/sub-categories';



interface ColumnDefinition {
  headerName: string;
  propertyName: string;
  body?: (data: ICategory) => ReactNode;
}

// Component for the subcategory column
const SubcategoryCell = ({ categoryId }: { categoryId: string }) => {
  const [subcategories, setSubcategories] = useState<ISubCategory[]>([]);
  const { data, loading } = useQueryGQL(
    GET_SUBCATEGORIES_BY_PARENT_ID,
    { parentCategoryId: categoryId },
    { enabled: !!categoryId }
  ) as IQueryResult<ISubCategoryByParentIdResponse | undefined, { parentCategoryId: string }>;

  useEffect(() => {
    if (data?.subCategoriesByParentId) {
      setSubcategories(data.subCategoriesByParentId);
    }
  }, [data]);

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>;
  if (!subcategories.length) return <div className="text-gray-400 text-sm italic">None</div>;

  return (
    <div className="space-y-1">
      {subcategories.map((sub) => (
        <div key={sub._id} className="flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5"></span>
          <span>{sub.title}</span>
        </div>
      ))}
    </div>
  );
};

export const CATEGORY_TABLE_COLUMNS = ({
  menuItems,
  shopType,
  setIsAddSubCategoriesVisible,
}: {
  menuItems: IActionMenuProps<ICategory>['items'];
  shopType: string;
  setIsAddSubCategoriesVisible: Dispatch<
    SetStateAction<{
      bool: boolean;
      parentCategoryId: string;
    }>
  >;
}) => {
  // Hooks
  const t = useTranslations();



  // Define base columns
  const columns: ColumnDefinition[] = [];

  if (shopType === 'grocery') {
    columns.push({
      headerName: t('Image'),
      propertyName: 'image',
      body: (item: ICategory) =>
        item.image ? (
          <Image src={item.image} width={40} height={40} alt="item.png" />
        ) : (
          <></>
        ),
    })
  }
  columns.push({ headerName: t('Title'), propertyName: 'title' })
  
  
  // Add subcategories column if shop type is grocery
  if (shopType === 'grocery') {
    columns.push({
      headerName: t('Subcategories'),
      propertyName: 'subcategories',
      body: (category: ICategory) => <SubcategoryCell categoryId={category._id} />
    });
    columns.push({
      headerName: t('Subcategories'),
      propertyName: 'subcategories',
      body: (category: ICategory) => <SubcategoryCell categoryId={category._id} />
    });
  }
  
  // Add actions column
  columns.push({
    propertyName: 'actions',
    headerName: '',
    body: (rider: ICategory) => {
      return (
        <div className="flex justify-between items-center">
          {shopType === 'grocery' && (
            <div>
              <TextIconClickable
                icon={faAdd}
                onClick={() =>
                  setIsAddSubCategoriesVisible({
                    bool: true,
                    parentCategoryId: rider._id,
                  })
                }
                title={t('Add Sub-Category')}
                className="border border-gray-400 border-dashed"
              />
            </div>
          )}
          <ActionMenu items={menuItems} data={rider} />
        </div>
      );
    },
  });

  return columns;
};