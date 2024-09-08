import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";


export const create = mutation({
    args: {
        name: v.string(),
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const member = await ctx.db.query("members")
            .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId))
            .unique();

        if (!member || member.role !== "admin") {
            throw new Error("Unauthorized");
        }

        const parseName = args.name.replace(/\s+/g, "-").toLowerCase();

        const channelId = await ctx.db.insert("channels", {
            name: parseName,
            workspaceId: args.workspaceId
        })

        return channelId;
    }
})

export const update = mutation({
    args: {
        name: v.string(),
        channelId: v.id("channels"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const channel = await ctx.db.get(args.channelId);
        if(!channel){
            throw new Error("Channel not found");
        }
        const member = await ctx.db.query("members")
            .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", channel.workspaceId).eq("userId", userId))
            .unique();

        if (!member || member.role !== "admin") {
            throw new Error("Unauthorized");
        }
        
        const parseName = args.name.replace(/\s+/g, "-").toLowerCase();

        await ctx.db.patch(args.channelId,{
            name: parseName,
            workspaceId: channel.workspaceId
        })

        return args.channelId;
    }
})

export const remove = mutation({
    args: {
        channelId: v.id("channels"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const channel = await ctx.db.get(args.channelId);
        if(!channel){
            throw new Error("Channel not found");
        }
        const member = await ctx.db.query("members")
            .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", channel.workspaceId).eq("userId", userId))
            .unique();

        if (!member || member.role !== "admin") {
            throw new Error("Unauthorized");
        }
        
        const [messages] = await Promise.all([
            ctx.db.query("messages")
                .withIndex("by_channel_id", (q)=>
                    q.eq("channelId", args.channelId)
                ).collect()
        ])

        for(const message of messages){
            await ctx.db.delete(message._id)
        }
        
        await ctx.db.delete(args.channelId)

        return args.channelId;
    }
})

export const get = query({
    args: {
        workspaceId: v.id("workspaces")
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            return [];
        }

        const member = await ctx.db.query("members")
            .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId))
            .unique();

        if (!member) {
            return [];
        }

        const channels = await ctx.db.query("channels")
            .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
            .collect();

        return channels;
    },
})
export const getById = query({
    args: {
        id: v.id("channels")
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            return null;
        }

        const channel = await ctx.db.get(args.id);
        if (!channel) {
            return null;
        }

        const member = await ctx.db.query("members")
            .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", channel.workspaceId).eq("userId", userId))
            .unique();
        if (!member) {
            return null;
        }
        
        return channel;
    },
})