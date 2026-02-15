import { createServer, mindmapTools } from "staruml-controller-mcp-core"

export function createMindmapServer() {
    return createServer("staruml-controller-mindmap", "1.0.0", mindmapTools)
}
