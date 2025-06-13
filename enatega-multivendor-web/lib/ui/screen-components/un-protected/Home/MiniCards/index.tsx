import HomeMiniCard from '@/lib/ui/useable-components/Home-miniCard'
import React from 'react'

const MiniCards:React.FC = () => {
  return (
    <div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-sols-4 gap-8 mt-[30px] mb-[30px]'>
        <HomeMiniCard image={"https://images.ctfassets.net/23u853certza/2alPBNdBAcXwckvXjbjWvH/542aac95909dbaa25b9774eb0e092860/3DLivingroom.png?w=960&q=90&fm=webp"} heading={"Boost your sales"} subText={"91% of Wolt orders are extra sales you wouldn’t otherwise get."} backColor={"#fff0ee"} headingColor={"#cb5965"}/>
        <HomeMiniCard image={"https://images.ctfassets.net/23u853certza/62XiVYgUMckBTyPl11EVgw/9a0abac47bbd4f788800df7c3bc7c705/3DCouriers.png?w=960&q=90&fm=webp"} heading={"We do the heavy lifting"} subText={"We handle ads, payments, delivery and support."} backColor={"#eaf7fc"} headingColor={"#009de0"}/>
        <HomeMiniCard image={"https://images.ctfassets.net/23u853certza/GWTxYReIUvlZ9CqqZVYi2/2c47a3b3d47030e1dd4c9c498c3bc189/3DYuhoRainjacket.png?w=960&q=90&fm=webp"} heading={"It's 100% risk-free"} subText={"There's no fee for joining Wolt. You can quit whenever, for any reason. When you earn, we earn."} backColor={"#fff9ef"} headingColor={"#c68000"}/>
        <HomeMiniCard image={"https://images.ctfassets.net/23u853certza/7cXP59KeAyDH1RT7fIi39K/620cc38c08a8a8232bcf0e2db1f15a44/WoltDriveIllustration.png?w=960&q=90&fm=webp"} heading={"Power online sales with same-hour deliveries"} subText={"Add Wolt Drive logistics for fast, affordable express deliveries for e-commerce. "} backColor={"#f0faef"} headingColor={"#1dc707"}/>
      </div>
    </div>
  )
}

export default MiniCards
