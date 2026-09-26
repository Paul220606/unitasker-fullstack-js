import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        hookTimeout: 60000,
        env: {
            MONGOMS_SKIP_MD5_CHECK: 'true',
            MONGOMS_DOWNLOAD_DIR: 'E:\\.cache\\mongodb-binaries'
        }
    }
})