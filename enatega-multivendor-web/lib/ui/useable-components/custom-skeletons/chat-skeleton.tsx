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
                  ? 'skeleton-surface ml-auto rounded-tr-none' 
                  : 'skeleton-surface mr-auto rounded-tl-none'
              }`}
            >
              {/* Message content with random widths */}
              <div className="skeleton-line mb-2 h-4 w-full rounded-full"></div>
              <div className={`skeleton-line mb-2 h-4 rounded-full ${isAdmin ? 'w-3/4' : 'w-4/5'}`}></div>
              {index % 3 === 0 && <div className="skeleton-line mb-2 h-4 w-1/2 rounded-full"></div>}
              
              {/* Timestamp */}
              <div className="skeleton-line ml-auto mt-2 h-3 w-32 rounded-full"></div>
            </div>
          );
        })}
      </div>
    );
  }
