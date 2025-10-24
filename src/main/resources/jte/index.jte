@param String title

@template.components.layout(title = title, content = @`
    <style>
        html { scroll-behavior: smooth; }
    </style>

    <!-- Navbar -->
    <nav class="fixed top-0 left-0 w-full z-50 bg-transparent">
        <div class="container mx-auto flex justify-between items-center py-4 px-6 md:px-20">
            <img src="/images/logo.png" alt="logo" class="w-20 h-auto"/>
            <ul class="hidden md:flex gap-7 text-white">
                <a href="#home" class="cursor-pointer hover:text-gray-400">Home</a>
                <a href="#about" class="cursor-pointer hover:text-gray-400">About</a>
                <a href="#services" class="cursor-pointer hover:text-gray-400">Services</a>
                <a href="#contact" class="cursor-pointer hover:text-gray-400">Contact</a>
            </ul>
            <a href="/login" class="hidden md:block bg-white text-gray-900 px-8 py-2 rounded-full hover:bg-gray-100">Login</a>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="min-h-screen flex items-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <div class="container mx-auto text-center px-6 md:px-20 text-white">
            <h1 class="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
                Transform Your Financial Future
            </h1>
            <p class="text-xl md:text-2xl mb-10 text-blue-100">
                Flexible loans with competitive rates to help you achieve your goals
            </p>
            <div class="space-x-4">
                <a href="/register" class="inline-block bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
                    Get Started
                </a>
                <a href="#about" class="inline-block border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-900 transition">
                    Learn More
                </a>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-20 bg-white">
        <div class="container mx-auto px-6 md:px-20">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold mb-4">About Our Service</h2>
                <p class="text-gray-600 max-w-2xl mx-auto">
                    We provide flexible loan solutions tailored to your needs with transparent terms and competitive rates
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="text-center p-6">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class='bx bx-check-shield text-3xl text-blue-600'></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Secure & Safe</h3>
                    <p class="text-gray-600">Your financial data is protected with bank-level security</p>
                </div>

                <div class="text-center p-6">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class='bx bx-rocket text-3xl text-blue-600'></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Fast Approval</h3>
                    <p class="text-gray-600">Get approved in as little as 24 hours</p>
                </div>

                <div class="text-center p-6">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class='bx bx-support text-3xl text-blue-600'></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">24/7 Support</h3>
                    <p class="text-gray-600">Our team is always here to help you</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-20 bg-gray-50">
        <div class="container mx-auto px-6 md:px-20">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold mb-4">Our Loan Products</h2>
                <p class="text-gray-600 max-w-2xl mx-auto">
                    Choose from a variety of loan products designed to meet your specific needs
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                    <i class='bx bx-user text-4xl text-blue-600 mb-4'></i>
                    <h3 class="text-xl font-semibold mb-2">Personal Loans</h3>
                    <p class="text-gray-600 mb-4">Flexible personal loans for any purpose</p>
                    <a href="/register" class="text-blue-600 hover:text-blue-700">Learn more →</a>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                    <i class='bx bx-car text-4xl text-blue-600 mb-4'></i>
                    <h3 class="text-xl font-semibold mb-2">Auto Loans</h3>
                    <p class="text-gray-600 mb-4">Finance your dream car with low rates</p>
                    <a href="/register" class="text-blue-600 hover:text-blue-700">Learn more →</a>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                    <i class='bx bx-briefcase text-4xl text-blue-600 mb-4'></i>
                    <h3 class="text-xl font-semibold mb-2">Business Loans</h3>
                    <p class="text-gray-600 mb-4">Grow your business with our capital</p>
                    <a href="/register" class="text-blue-600 hover:text-blue-700">Learn more →</a>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                    <i class='bx bx-home text-4xl text-blue-600 mb-4'></i>
                    <h3 class="text-xl font-semibold mb-2">Home Loans</h3>
                    <p class="text-gray-600 mb-4">Own your dream home today</p>
                    <a href="/register" class="text-blue-600 hover:text-blue-700">Learn more →</a>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section id="contact" class="py-20 bg-blue-900 text-white">
        <div class="container mx-auto px-6 md:px-20 text-center">
            <h2 class="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p class="text-xl mb-10 text-blue-100">
                Join thousands of satisfied customers who have achieved their financial goals with us
            </p>
            <a href="/register" class="inline-block bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
                Apply Now
            </a>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-10">
        <div class="container mx-auto px-6 md:px-20 text-center">
            <p>&copy; 2025 Loan Management System. All rights reserved.</p>
            <p class="text-gray-400 mt-2">Built with Spring Boot + JTE + Tailwind CSS</p>
        </div>
    </footer>
`)
