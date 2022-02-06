import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
    ssr: true,
    buildModules: [
        'nuxt3-module-bug'
    ]
})