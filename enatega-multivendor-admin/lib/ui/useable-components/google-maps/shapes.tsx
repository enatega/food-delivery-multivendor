import { CircleSVG } from '@/lib/utils/assets/svgs/circle';
import { PointLineSVG } from '@/lib/utils/assets/svgs/point-line';
import { PolygonSVG } from '@/lib/utils/assets/svgs/polygon';
import { ICustomShapeComponentProps } from '@/lib/utils/interfaces';

export default function CustomShape({
  selected,
  onClick,
  hidenNames = [],
}: ICustomShapeComponentProps) {
  const items = [
    {
      value: 'point',
      child: (
        <>
          <PointLineSVG
            strokeColor={selected === 'point' ? 'white' : 'black'}
          />
          <p className="mt-2 text-center">Point</p>
        </>
      ),
    },
    {
      value: 'radius',
      child: (
        <>
          <CircleSVG strokeColor={selected === 'radius' ? 'white' : 'black'} />
          <p className="mt-2 text-center">Circle</p>
        </>
      ),
    },
    {
      value: 'polygon',
      child: (
        <>
          <PolygonSVG
            strokeColor={selected === 'polygon' ? 'white' : 'black'}
          />
          <p className="mt-2 text-center">Polygon</p>
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
            className={`flex flex-col items-center justify-center p-3 ${item.value === selected
              ? 'bg-black text-white'
              : 'bg-[#F4F4F5] text-black'
              } w-30 h-30 transform rounded-lg shadow transition duration-300 ease-in-out hover:scale-105 focus:outline-none active:bg-gray-800`}
            type='button'
            onClick={() => onClick(item.value)}
          >
            {item.child}
          </button>
        );
      })}
    </div>
  );
}
