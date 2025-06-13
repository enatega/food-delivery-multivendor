// import libraries
import React from 'react'


// import components
import EmailForm from '@/lib/ui/useable-components/RiderandRestaurantsInfos/Form'
import Heading from '@/lib/ui/useable-components/RiderandRestaurantsInfos/Heading/Heading'
import WhyCardsList from '@/lib/ui/useable-components/RiderandRestaurantsInfos/WhyCards/WhyCardsList'
import WhyChoose from '@/lib/ui/useable-components/RiderandRestaurantsInfos/WhyChoose'

// import images
import growth from "@/public/assets/images/png/Growth.png"
import getMoreOrders from "@/public/assets/images/png/GetMoreOrders.png"
import deliverMoreCustomers from "@/public/assets/images/png/deliverToCustomer.png"
import StartingImage from '@/lib/ui/useable-components/RiderandRestaurantsInfos/StartingImage/StartingImage'
import RiderBanner from '@/public/assets/images/png/RidersBanner.webp'

// cards Data
const cards=[
    {heading:"Grow with Enatega",text:"Access our active customer base by offering pickup and delivery on the Enatega app.",image:growth,color:"#f7fbfe"},
    {heading:"Get more orders",text:"With Enatega, you can increase your orders by reaching our active customers. Joining is free and pricing is commission based.",image:getMoreOrders,color:"#faf7fc"},
    {heading:"Deliver to more customers",text:"After an order is placed, Enatega rider partners deliver to your customers in about 30 minutes. ",image:deliverMoreCustomers,color:"#fbfbfb"}
    ]
    
// Rider Page
const Rider = () => {
  return (
    <div className='w-screen  h-auto'>
      <Heading heading={"Become an Enatega Rider"} />
      <StartingImage image={RiderBanner}/>
      <WhyChoose heading='Why Deliver with Enatgea' subHeading="As an Enatega Rider Partner, you can earn money by delivering orders to local customers. You can have a flexible schedule, so you deliver in the place or at the time that suits you the most. It's easy to start earning - no previous delivery experience is required!" />
      <WhyCardsList cards={cards}/>
      <hr  className='w-[30%] ml-12 border-4 border-green-400 my-12 rounded'/>
      <EmailForm heading={"Become a Rider "} role={"Driver Registration"}/>
    
    </div>
  )
}

export default Rider
