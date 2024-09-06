"use client";

import Thread from "@/components/Thread";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { usePanel } from "@/hooks/usePanel";
import { Loader } from "lucide-react";
import { ReactNode } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";
import WorkspaceSidebar from "./WorkspaceSidebar";

interface WorkspaceIdLayoutProps {
  children: ReactNode
}
const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  const { onClose, parentMessageId } = usePanel();

  const showPanel = !!parentMessageId;

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="sc-workspace-layout"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5E2C5F]"
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            minSize={20}
          >
            {children}
          </ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel
                defaultSize={29}
                minSize={20}
              >
                {parentMessageId ? (
                  <Thread 
                    messageId={parentMessageId as Id<"messages">}
                    onClose={onClose}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default WorkspaceIdLayout;