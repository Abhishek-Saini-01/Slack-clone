import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetMemberByIdProps {
    memberId: Id<"members">
}
export const useGetMemberById = ({ memberId }: UseGetMemberByIdProps) => {
    const data = useQuery(api.members.getById, {
        memberId
    });
    const isLoading = data === undefined;
    return {data, isLoading};
}