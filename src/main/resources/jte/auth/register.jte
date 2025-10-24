@param String title

@template.components.layout(title = title, content = @`
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 py-12 px-4">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
            <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                <p class="text-gray-600">Join us today and start managing your loans</p>
            </div>

            <form action="/register" method="post" class="space-y-4">
                <div>
                    <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                    </label>
                    <input type="text" id="fullName" name="fullName" required
                           class="input-field"
                           placeholder="Enter your full name">
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input type="email" id="email" name="email" required
                           class="input-field"
                           placeholder="Enter your email">
                </div>

                <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                    </label>
                    <input type="tel" id="phone" name="phone"
                           class="input-field"
                           placeholder="Enter your phone number">
                </div>

                <div>
                    <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                        Address
                    </label>
                    <input type="text" id="address" name="address"
                           class="input-field"
                           placeholder="Enter your address">
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>
                    <input type="password" id="password" name="password" required
                           class="input-field"
                           placeholder="Create a password">
                </div>

                <button type="submit" class="w-full btn-primary">
                    Create Account
                </button>
            </form>

            <div class="mt-6 text-center">
                <p class="text-sm text-gray-600">
                    Already have an account?
                    <a href="/login" class="text-blue-600 hover:text-blue-500 font-medium">Sign in</a>
                </p>
            </div>
        </div>
    </div>
`)
