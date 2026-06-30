import { useContext } from "react"
import { WorkspaceContext } from "../context/WorkspaceContext"

function useWorkspace() {
    return useContext(WorkspaceContext)
}

export default useWorkspace
