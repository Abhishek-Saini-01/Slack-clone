import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetWorkspaceById {
    id: Id<"workspaces">
}
export const useGetWorkspaceById = ({ id }:UseGetWorkspaceById) => {
    const data = useQuery(api.workspaces.getById, {id});
    const isLoading = data === undefined;
    return { data, isLoading };
}