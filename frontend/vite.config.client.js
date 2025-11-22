export default {
    root: './',
    server: {
        port: 1911,
        open: '/client/pages/Authentication/index.html',
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true
            },
            '/frontend/client': {
                target: 'http://localhost:1911',
                rewrite: (path) => path.replace(/^\/frontend\/client/, '/client')
            }
        }
    },
    resolve: {
        alias: {
            '/frontend/client': '/client'
        }
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: './client/pages/Authentication/index.html'
            }
        }
    }
}