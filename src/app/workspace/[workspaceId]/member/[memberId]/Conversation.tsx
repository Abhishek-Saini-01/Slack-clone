import MessageList from '@/components/MessageList';
import { useGetMemberById } from '@/features/members/api/useGetMemberById';
import { useGetMessages } from '@/features/messages/api/useGetMessages';
import { useMemberId } from '@/hooks/useMemberId';
import { Loader } from 'lucide-react';
import { Id } from '../../../../../../convex/_generated/dataModel';
import ChatInput from './ChatInput';
import Header from './Header';

interface ConversationProps {
    id: Id<"conversations">
}
const Conversation = ({
    id
}: ConversationProps) => {
    const memberId = useMemberId();
    const { data: member, isLoading: memberLoading } = useGetMemberById({ memberId })
    const { results, status, loadMore } = useGetMessages({
        conversationId: id,
    });

    if (memberLoading || status === "LoadingFirstPage") {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
        )
    }



    return (
        <div  className='flex flex-col h-full'>
            <Header
                memberName={member?.user.name}
                memberImage={member?.user.image}
                onClick={()=>{}}
            />
            <MessageList 
                data={results}
                variant='conversation'
                memberName={member?.user.name}
                memberImage={member?.user.image}
                loadMore={loadMore}
                isLoadingMore={status === "LoadingMore"}
                canLoadMore={status === "CanLoadMore"}
                
            />
            <ChatInput 
                placeholder={`Message ${member?.user.name}`}
                conversationId={id}
            />
        </div>
    )
}

export default Conversation