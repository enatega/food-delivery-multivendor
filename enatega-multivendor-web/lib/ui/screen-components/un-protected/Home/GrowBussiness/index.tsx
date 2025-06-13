// libraries
import React from 'react'

// component
import MoveableCard from '@/lib/ui/useable-components/Moveable-Card'
import TranparentButton from '@/lib/ui/useable-components/Home-Buttons/TranparentButton'

//images 
import Banner3 from '@/public/assets/images/png/Banner3.png'

const GrowBussiness:React.FC = () => {
  const growButon=<TranparentButton text={"Get Started"} link='restaurantInfo'/>

  return (
    <div className='w-full'>
        <MoveableCard 
        image={Banner3}
        heading={"For restaurants and stores"}
        subText={"Let's grow your business together"}
        middle={true}
        button={growButon}
        />
    </div>
  )
}

export default GrowBussiness
