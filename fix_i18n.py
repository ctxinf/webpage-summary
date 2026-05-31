import re

with open("lib/i18n.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Fix unescaped single quotes in French chunk
content = content.replace("'Une erreur inconnue s'est produite.'", "'Une erreur inconnue s\\'est produite.'")
content = content.replace("'Rien n'est sélectionné.'", "'Rien n\\'est sélectionné.'")
content = content.replace("'Envoyer lors de l'ajout'", "'Envoyer lors de l\\'ajout'")
content = content.replace("'Résumé de l'article'", "'Résumé de l\\'article'")
content = content.replace("'Créer un modèle avant l'appel'", "'Créer un modèle avant l\\'appel'")
content = content.replace("'À partir d'un préréglage'", "'À partir d\\'un préréglage'")

# Also fix the comma issue at the end of zh-CN
content = content.replace("  },\n  'zh-TW': {", "  },\n  'zh-TW': {")
# Actually, the original was:
#    siteCustomization: {
#      ...
#    },
#  },
#  'zh-TW': {
content = re.sub(r"  \},\n  'zh-TW': \{", "  },\n  'zh-TW': {", content)

# Wait, if there's no comma after the zh-CN object, let's just make sure there is one.
# It should match:
#  },
#  'zh-TW': {
content = re.sub(r"  \},\n  'zh-TW':", "  },\n  'zh-TW':", content) # wait, that does nothing

# The actual issue is that zh-CN didn't have a trailing comma before 'zh-TW' was added.
content = content.replace("    },\n  }\n  'zh-TW': {", "    },\n  },\n  'zh-TW': {")
content = content.replace("    },\n  },\n  'zh-TW': {", "    },\n  },\n  'zh-TW': {")

with open("lib/i18n.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed French single quotes")
