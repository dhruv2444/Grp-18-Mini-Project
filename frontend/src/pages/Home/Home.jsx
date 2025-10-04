import React, { useState } from 'react';
import { ChevronDown, Brain, Target, TrendingUp, Users, Play, CheckCircle, Menu, X } from 'lucide-react';
import { Link } from "react-router-dom";
const Home = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
     

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Unlock Your Potential with{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered
              </span>{' '}
              Productivity Coaching
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Transform your habits, optimize your workflow, and achieve your goals with personalized coaching powered by machine learning and behavioral science.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/uploads"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-black px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 inline-block"
              >
              Start Your Free Trial
              </Link>
              
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-indigo-600 hover:text-indigo-600 hover:-translate-y-1 transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powered by AI & Behavioral Science
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our advanced machine learning algorithms analyze your patterns and provide personalized insights for maximum productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-gray-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Behavior Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced algorithms analyze your work patterns, identify bottlenecks, and suggest personalized optimizations for peak performance.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gray-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Goal Setting</h3>
              <p className="text-gray-600 leading-relaxed">
                ML-powered goal recommendations based on your capacity, preferences, and historical performance data.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gray-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant feedback and actionable insights to make micro-adjustments that compound into massive improvements.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-gray-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personalized Coaching</h3>
              <p className="text-gray-600 leading-relaxed">
                1-on-1 sessions with AI-enhanced coaches who understand your unique behavioral patterns and motivations.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-gray-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Habit Formation</h3>
              <p className="text-gray-600 leading-relaxed">
                Science-backed habit formation strategies powered by behavioral psychology and reinforcement learning.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-gray-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Progress Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Visual dashboards and detailed analytics to track your improvement and celebrate your wins along the journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Dropdown Section */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive AI-powered solutions tailored to your productivity needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 1-on-1 AI Coaching */}
            <div className="group bg-gray-50 p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">1-on-1 AI Coaching</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Personalized coaching sessions with AI-enhanced insights and behavioral analysis.
              </p>
              <div className="mt-4">
                <a href="#coaching" className="text-indigo-600 text-sm font-medium hover:text-purple-600 transition-colors">
                  Learn More →
                </a>
              </div>
            </div>

            {/* Behavior Analysis */}
            <div className="group bg-gray-50 p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Behavior Analysis</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Deep ML analysis of your work patterns, habits, and productivity bottlenecks.
              </p>
              <div className="mt-4">
                <a href="#analysis" className="text-indigo-600 text-sm font-medium hover:text-purple-600 transition-colors">
                  Learn More →
                </a>
              </div>
            </div>

            {/* Custom Plans */}
            <div className="group bg-gray-50 p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Custom Plans</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Tailored productivity plans based on your unique goals and behavioral data.
              </p>
              <div className="mt-4">
                <a href="#plans" className="text-indigo-600 text-sm font-medium hover:text-purple-600 transition-colors">
                  Learn More →
                </a>
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="group bg-gray-50 p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Progress Tracking</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Real-time dashboards and analytics to monitor your productivity journey.
              </p>
              <div className="mt-4">
                <a href="#tracking" className="text-indigo-600 text-sm font-medium hover:text-purple-600 transition-colors">
                  Learn More →
                </a>
              </div>
            </div>
          </div>

          {/* Service Features Grid */}
          <div className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">What's Included in Every Service</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-indigo-600" />
                <span className="text-gray-700">AI-Powered Insights</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-indigo-600" />
                <span className="text-gray-700">Behavioral Analysis</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-indigo-600" />
                <span className="text-gray-700">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-indigo-600" />
                <span className="text-gray-700">Progress Dashboard</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-indigo-600" />
                <span className="text-gray-700">Mobile App Access</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-indigo-600" />
                <span className="text-gray-700">Weekly Reports</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to transform your productivity with AI-powered insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect & Assess</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect your tools and complete our comprehensive behavioral assessment to understand your unique productivity patterns.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Our machine learning algorithms analyze your data to identify patterns, bottlenecks, and opportunities for improvement.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personalized Plan</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive a customized productivity plan with actionable steps, habit recommendations, and ongoing coaching support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of professionals who have already unlocked their potential with AI-powered coaching.
          </p>
          <button className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                AI ProductivityPro
              </div>
              <p className="text-gray-400 text-sm">
                Transforming productivity with AI-powered coaching and behavioral science.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">1-on-1 Coaching</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Behavior Analysis</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Custom Plans</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Progress Tracking</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © 2025 AI ProductivityPro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;