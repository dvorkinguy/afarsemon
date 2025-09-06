# Claude Instructions

Current date: 06 September 2025

- Always run the LINT and TYPESCHECK scripts after completing your changes. This is to check for any issues.
- Always start the dev server yourself after completing changes. Use npx kill to free up port 3000.
- Avoid using custom colors unless very specifically instructed to do so. Stick to standard tailwind and shadcn colors, styles and tokens.
- Always test the code when implementing features.
- Always use agents.

## MCP Server Usage Guidelines

- **Documentation**: Use `context7` MCP server for any documentation related issues
- **UI Testing**: Always use `playwright` MCP server to check User Interface and functionality
- **GitHub Operations**: Use `github` MCP for repository analysis, releases, and security advisories
- **Workflow Automation**: Use `n8n` MCP for automation and workflow tasks
- **Document Conversion**: Use `markitdown` MCP for converting documents to markdown
- **Task-Specific Selection**: Choose appropriate MCP server based on task domain:
  - Browser/UI → Playwright MCP
  - Code Repository → GitHub MCP  
  - Documentation → Context7 MCP
  - Automation → N8N MCP
  - File Conversion → Markitdown MCP
  - Development → Terminal + selective filesystem MCP

## MCP Response Size Management

- **FORBIDDEN**: Query entire repo root with directory_tree MCP
- **REQUIRED**: Use specific paths like `/src`, `/apps/www/src`, `/packages/[name]`
- **MANDATORY**: Limit terminal outputs with `| head -N`, `| tail -N`, `| grep pattern`
- **PREFERRED**: Use `find` with filters over broad directory queries
- **RULE**: Always check directory size with `ls | wc -l` before full listing
- **LIMIT**: Never query more than 50 items without explicit user request

Example good queries:
- `find ./src -name "*.tsx" | head -20`
- `ls -la ./apps/www/src/components`
- `tree -L 2 ./packages`

Example bad queries:
- `tree ./` (entire repo)
- `find . -type f` (all files)
- Any MCP query on root without limits