# nuxt3-module-bug

Production build inlines external lib in server chunk 'output/server/chunks/app/server.mjs' and breaks build.
This happens if you have a nuxt3 module as a node module that adds a plugin for server mode with an imported library (in this case firebase-admin).

Git repository
https://github.com/DevJoghurt/nuxt3-module-bug

## Reproduction
```
yarn install
yarn build
yarn start
```

## Module

index.mjs
```
import { resolve } from 'pathe';
import { fileURLToPath } from 'url';
import { defineNuxtModule, addPluginTemplate } from '@nuxt/kit';

const testModule = defineNuxtModule({
  meta: {
    name: "nuxt3-module-bug"
  },
  name: "nuxt3-module-bug",
  defaults: {},
  async setup(options, nuxt) {
    const runtimeDir = fileURLToPath(new URL("./module", import.meta.url));
    nuxt.options.build.transpile.push(runtimeDir);
    addPluginTemplate({
      src: resolve(runtimeDir, "firebase.server.js"),
      filename: "firebase.server.js",
      mode: "server"
    });
  }
});

export { testModule as default };
```

module/firebase.server.js
```
import { defineNuxtPlugin  } from '#app'
import { initializeApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

export default defineNuxtPlugin(async (nuxtApp) => {

    const apps = getApps()
    if (!apps.length) {
        initializeApp({ 
            projectId: 'default'
        })
    }
    const firestoreDb = getFirestore()
    //it is only allowed to set settings once
    if(!apps.length){
        firestoreDb.settings({
            host: "localhost:8080",
            ssl: false
        })
    }

    nuxtApp.provide('fs', {
        firestore: {
            db: firestoreDb
        }
    })
})
```