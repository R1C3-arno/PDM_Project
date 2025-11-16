tailwind.config = {
    theme: {
        extend: {
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'fade-in': 'fadeIn 0.6s ease-out'
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' }
                },
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                }
            }
        }
    }
}