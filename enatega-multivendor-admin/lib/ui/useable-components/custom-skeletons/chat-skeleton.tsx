// Path: /lib/ui/useable-components/custom-skeletons/chat-skeleton.tsx

interface IChatSkeletonProps {
    messageCount?: number;
  }
  
  export default function ChatSkeleton({ messageCount = 5 }: IChatSkeletonProps) {
    // Create an array of indices for iteration
    const messages = Array.from({ length: messageCount }, (_, i) => i);
    
    return (
      <div className="space-y-4 animate-pulse p-4">
        {messages.map((index) => {
          // Alternate between left (user) and right (admin) messages
          const isAdmin = index % 2 !== 0;
          
          return (
            <div 
              key={index}
              className={`p-3 rounded-lg max-w-[80%] ${
                isAdmin 
                  ? 'bg-green-200 text-white ml-auto rounded-tr-none' 
                  : 'bg-gray-200 text-gray-800 mr-auto rounded-tl-none'
              }`}
            >
              {/* Message content with random widths */}
              <div className="h-4 bg-gray-300 rounded-full w-full mb-2"></div>
              <div className={`h-4 bg-gray-300 rounded-full ${isAdmin ? 'w-3/4' : 'w-4/5'} mb-2`}></div>
              {index % 3 === 0 && <div className="h-4 bg-gray-300 rounded-full w-1/2 mb-2"></div>}
              
              {/* Timestamp */}
              <div className="h-3 bg-gray-300 rounded-full w-32 mt-2 ml-auto"></div>
            </div>
          );
        })}
      </div>
    );
  }