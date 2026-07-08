import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import '../server/src/config.js'
import { registerApiTools } from './tools/api.js'
import { registerDbTools } from './tools/db.js'

const server = new McpServer({
  name: 'thinkloop',
  version: '1.0.0',
})

registerDbTools(server)
registerApiTools(server)

const transport = new StdioServerTransport()
await server.connect(transport)
