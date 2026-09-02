import { CircleSVG } from '@/lib/utils/assets/svgs/circle';
import { PointLineSVG } from '@/lib/utils/assets/svgs/point-line';
import { PolygonSVG } from '@/lib/utils/assets/svgs/polygon';
import { ICustomShapeComponentProps } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

export default function CustomShape({
  selected,
  onClick,
  hidenNames = [],
}: ICustomShapeComponentProps) {
  // Hooks
  const t = useTranslations();
  const { theme } = useTheme();

  const items = [
    {
      value: 'point',
      child: (
        <>
          <PointLineSVG
            strokeColor={selected === 'point' ? 'white' : theme === `dark`? "white" :"black" }
          />
          <p className="mt-2 text-center">{t('Point')}</p>
        </>
      ),
    },
    {
      value: 'radius',
      child: (
        <>
          <CircleSVG strokeColor={selected === 'radius' ? 'white' : theme === `dark`? "white" :"black"} />
          <p className="mt-2 text-center">{t('Circle')}</p>
        </>
      ),
    },
    {
      value: 'polygon',
      child: (
        <>
         <PolygonSVG
            strokeColor={selected === 'polygon' ? 'white' : theme === `dark`? "white" :"black"}
          />
          <p className="mt-2 text-center">{t('Polygon')}</p>
        </>
      ),
    },
  ];

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map((item, index: number) => {
        if (
          hidenNames.some(
            (hidden: string) => hidden.toLowerCase() === item.value
          )
        )
          return;

        return (
          <button
            key={`${item.value}-${index}`}
            className={`flex flex-col items-center justify-center p-3 ${
              item.value === selected
                ? 'bg-black dark:bg-dark-900 text-white border dark:border-dark-600'
                : 'bg-[#F4F4F5] text-black dark:bg-dark-900 dark:text-white '
            } w-30 h-30 transform rounded-lg shadow transition duration-300 ease-in-out hover:scale-105 focus:outline-none active:bg-gray-800`}
            type="button"
            onClick={() => onClick(item.value)}
          >
            {item.child}
          </button>
        );
      })}
    </div>
  );
}
