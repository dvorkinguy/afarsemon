- Always run the LINT and TYPESCHECK scripts after completing your changes. This is to check for any issues.
- Always start the dev server yourself. If you need something from the terminal, ask the user to provide it to you.
- Avoid using custom colors unless very specifically instructed to do so. Stick to standard tailwind and shadcn colors, styles and tokens.
- Always test the code when implementing features.
- Always use agents.
- Always use playwright mcp server to check User Interface and functionality.
- Always choose and use MCP servers

#!/bin/bash
# filepath: update_date.sh
sed -i "s/Current date:.*/Current date: $(date '+%d %B %Y')/" CLAUDE.md