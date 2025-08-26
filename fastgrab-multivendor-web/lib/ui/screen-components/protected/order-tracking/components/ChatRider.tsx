import React,{useState} from 'react'
import ChatWithRiderModal from './chatwithrider-modal'

interface ChatRiderProps{
  orderId:string,
  customerId:string
}

const ChatRider:React.FC<ChatRiderProps> = ({orderId,customerId}) => {
  const[showChats,setShowChats] = useState(false)

  const showChatWithRider = ()=>
  {
    setShowChats(true)
  }
  return (
    <div>
        <button onClick={showChatWithRider} className='p-2 bg-[#5AC12F] mx-2 my-2 rounded text-white w-[300px]'>Chat With Rider</button>
        <ChatWithRiderModal 
        visible={showChats}
        onHide={() => setShowChats(false)}
        orderId={orderId}
        currentUserId={customerId}
        />
    </div>
  )
}

export default ChatRider
