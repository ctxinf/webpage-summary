import re

with open("lib/i18n.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Replace "  },\n,\n  '" with "  },\n  '"
content = content.replace("  },\n,\n  '", "  },\n  '")

with open("lib/i18n.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed double commas")
