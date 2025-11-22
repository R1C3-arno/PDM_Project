export default {
    root: './server',
    server: {
        port: 2906,
        open: '/pages/Loan_Managment.html',
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true
            },
            '/frontend/server': {
                target: 'http://localhost:2906',
                rewrite: (path) => path.replace(/^\/frontend\/server/, '')
            }
        }
    },
    resolve: {
        alias: {
            '/frontend/server': ''
        }
    },
    build: {
        outDir: 'dist'
    }
}