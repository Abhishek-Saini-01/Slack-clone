import { ReactNode } from "react"

const WorkspaceLayout = ({children}:{
    children: ReactNode
}) => {
  return (
    <div className="h-full overflow-hidden">
        {children}
    </div>
  )
}

export default WorkspaceLayout