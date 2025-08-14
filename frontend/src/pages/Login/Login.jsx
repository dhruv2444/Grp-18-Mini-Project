import React, { useState } from 'react'
import useLogin from '../../hooks/useLogin';
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password)
  }

  return (
    <div className='h-[calc(100vh-100px)] bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-4'>
      <div className="max-w-5xl w-full flex h-full max-h-[650px]">
        {/* Left side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-white rounded-l-3xl shadow-xl items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <img 
              src="/img.png" 
              alt="login_image" 
              className="w-full h-auto max-h-80 object-contain"
            />
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 bg-white rounded-r-3xl lg:rounded-l-none rounded-l-3xl shadow-xl p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-md mx-auto">
            {/* Profile Icon */}
            <div className="mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
              </div>
            </div>

            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/Signup" className="text-blue-600 hover:text-blue-700 underline">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Show Password Checkbox */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="showPassword" className="ml-2 text-sm text-gray-700">
                    Show password
                  </label>
                </div>
                <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gray-800 text-white py-2.5 px-4 rounded-lg hover:bg-gray-900 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>

              {/* Alternative Signup */}
              <div className="text-center">
                <Link to="/Signup" className="text-sm text-gray-600 hover:text-gray-700">
                  Create an account instead
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login