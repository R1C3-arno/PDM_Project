@param String title

@template.components.layout(title = title, content = @`
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 py-12 px-4">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
            <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p class="text-gray-600">Sign in to your account</p>
            </div>

            <form action="/login" method="post" class="space-y-6">
                <div>
                    <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input type="email" id="username" name="username" required
                           class="input-field"
                           placeholder="Enter your email">
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>
                    <input type="password" id="password" name="password" required
                           class="input-field"
                           placeholder="Enter your password">
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox"
                               class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                        <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                            Remember me
                        </label>
                    </div>
                    <a href="#" class="text-sm text-blue-600 hover:text-blue-500">
                        Forgot password?
                    </a>
                </div>

                <button type="submit" class="w-full btn-primary">
                    Sign In
                </button>
            </form>

            <div class="mt-6 text-center">
                <p class="text-sm text-gray-600">
                    Don't have an account?
                    <a href="/register" class="text-blue-600 hover:text-blue-500 font-medium">Sign up</a>
                </p>
            </div>
        </div>
    </div>
`)
