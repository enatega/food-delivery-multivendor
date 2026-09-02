import Image from 'next/image';

// Interface
export interface IMessage {
  id: number;
  text: string;
  time: string;
  sender: 'user' | 'admin';
  avatar?: string;
  isRead?: boolean;
  ticketId: number;
}

export interface IChatMessageProps {
  message: IMessage;
  isAdmin?: boolean;
}

export default function ChatMessage({ message, isAdmin = false }: IChatMessageProps) {
  return (
    <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isAdmin && (
        <div className="mr-2 flex-shrink-0">
          <Image
            width={36}
            height={36}
            src={message.avatar || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}
            alt="User avatar"
            className="h-9 w-9 rounded-full"
          />
        </div>
      )}
      
      <div className={`max-w-[70%] px-4 py-2 rounded-lg ${
        isAdmin 
          ? 'bg-primary-dark text-white rounded-tr-none' 
          : 'bg-gray-100 text-gray-800 rounded-tl-none'
      }`}>
        <p className="text-sm">{message.text}</p>
        <div className="text-xs mt-1 text-right">
          {message.time}
        </div>
      </div>
      
      {isAdmin && (
        <div className="ml-2 flex-shrink-0">
          <Image
            width={36}
            height={36}
            src="/logo.png" // Use your admin/support logo
            alt="Support avatar"
            className="h-9 w-9 rounded-full bg-primary-dark p-1"
          />
        </div>
      )}
    </div>
  );
}