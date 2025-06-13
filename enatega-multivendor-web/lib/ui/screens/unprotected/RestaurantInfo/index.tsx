// library imports
import React from 'react'

// components imports
import EmailForm from '@/lib/ui/useable-components/RiderandRestaurantsInfos/Form'
import Heading from '@/lib/ui/useable-components/RiderandRestaurantsInfos/Heading/Heading'
import SideContainers from '@/lib/ui/useable-components/RiderandRestaurantsInfos/SideContainers/SideCard'
import WhyCardsList from '@/lib/ui/useable-components/RiderandRestaurantsInfos/WhyCards/WhyCardsList'
import WhyChoose from '@/lib/ui/useable-components/RiderandRestaurantsInfos/WhyChoose'
import StartingImage from '@/lib/ui/useable-components/RiderandRestaurantsInfos/StartingImage/StartingImage'


// image imports
import WorldClassCustomers from "@/public/assets/images/png/WorldClassCustomer.webp"
import enategaApp from "@/public/assets/images/png/enategaApp.png"
import growth from "@/public/assets/images/png/Growth.png"
import getMoreOrders from "@/public/assets/images/png/GetMoreOrders.png"
import deliverMoreCustomers from "@/public/assets/images/png/deliverToCustomer.png"
import restaurantBanner from "@/public/assets/images/png/restaurant-banner.png"



// cards data
const cards=[
    {heading:"Grow with Enatega",text:"Access our active customer base by offering pickup and delivery on the Enatega app.",image:growth,color:"#f7fbfe"},
    {heading:"Get more orders",text:"With Enatega, you can increase your orders by reaching our active customers. Joining is free and pricing is commission based.",image:getMoreOrders,color:"#faf7fc"},
    {heading:"Deliver to more customers",text:"After an order is placed, Enatega rider partners deliver to your customers in about 30 minutes. ",image:deliverMoreCustomers,color:"#fbfbfb"}
    ]

// Side Card Componet Data
const sideCards=[
{image:enategaApp,heading:"How Enatega works",subHeading:"A customer browses the Enatega app and places an order from your store. The order appears in the Merchant App for you to complete. Once packed and ready, a courier partner will arrive to pick up the order and deliver the goods to the customer. In total, it takes about 30 minutes for the customer to receive and enjoy their order.",right:false },
{image:WorldClassCustomers,heading:"World-class Customer Support for your success",subHeading:"Our 24/7 Customer Support replies in your local language in a matter of minutes. We’re available to you and your customers until the last order of the day is delivered. ",right:true}
]


// Restaurant Info Page
const RestInfo = () => {
  return (
    <div className='w-screen  h-auto'>
    <Heading heading={"Reach more customers and grow your business with Enatega"} subHeading={"Partner with Enatega to create more sales on the app and through your own website"}/>
    <StartingImage image={restaurantBanner}/>
    <WhyChoose heading='Why Deliver with Enatgea' subHeading="As an Enatega Rider Partner, you can earn money by delivering orders to local customers. You can have a flexible schedule, so you deliver in the place or at the time that suits you the most. It's easy to start earning - no previous delivery experience is required!" />
    <WhyCardsList cards={cards}/>
    <SideContainers sideCards={sideCards} />
    <hr  className='w-[30%] ml-12 border-4 border-green-400 my-12 rounded'/>
    <EmailForm heading={"Become a Restaurant"} role={"Vendor Registration"}/>
    
  
  </div>
  )
}

export default RestInfo