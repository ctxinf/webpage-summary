# CONTRIBUTING

## key dependencies
1. [wxt](https://github.com/wxt-dev/wxt)
2. vue3
3. tailwind
4. [shadcn-vue](https://github.com/unovue/shadcn-vue)
5. [vercel/ai](https://github.com/vercel/ai)

## directory structure
```

├── app.config.ts     #runtime contfig(version, ...)
├── components.json   #shadcn-vue config
├── connect-messaging.ts   #wrapper for .connect message api 
├── messaging.ts      #message defination @webext-core/messaging 
├── public/
│   ├── _locals/    #i18n jsons
│   └── ... 
├── entrypoints/      #browser extension scripts entrypoints
│   ├── background/ 
│   ├── options/    
│   ├── page.content/  #content scripts
│   └── popup/      
├── src/              
│   ├── components/    #resuable(for content/options) components 
│   │   ├── debug/     #will not be packaged into build
│   │   ├── custom-ui/ #custom shadcn-vue components
│   │   ├── ui/        #shadcn-vue generates
│   │   └── ...
│   ├── composables/     # composables(hooks)
│   ├── constants/       
│   ├── model-providers/  # create obj using user's llm config
│   ├── presets/          
│   ├── types/
│   └── utils/  
```

## dev locally
```sh
cp web-ext.config.ts.exmaple web-ext.config.ts
bun install
bun run dev
