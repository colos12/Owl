import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, Mail, Lock, User, Building, ArrowRight, CheckCircle } from 'lucide-react';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    businessName: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToMarketing: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;

    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful signup
      localStorage.setItem('owl_auth_token', 'mock_jwt_token');
      localStorage.setItem('owl_user', JSON.stringify({
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        businessName: formData.businessName
      }));
      
      navigate('/dashboard');
    } catch (error) {
      setErrors({ general: 'Signup failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return 'bg-red-400';
    if (strength <= 3) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%236366f1%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Owl</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Create Your Account</h1>
            <p className="text-slate-400">Start accepting crypto payments in minutes</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-teal-500 text-white' : 'bg-slate-600 text-slate-400'
              }`}>
                {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
              </div>
              <div className={`w-12 h-0.5 ${currentStep >= 2 ? 'bg-teal-500' : 'bg-slate-600'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? 'bg-teal-500 text-white' : 'bg-slate-600 text-slate-400'
              }`}>
                2
              </div>
            </div>
          </div>

          {/* Step 1: Personal & Business Info */}
          {currentStep === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-lg font-semibold text-white mb-1">Personal & Business Information</h2>
                <p className="text-slate-400 text-sm">Tell us about yourself and your business</p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-700 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:bg-slate-600 transition-colors duration-200 ${
                        errors.firstName ? 'border-red-400 focus:border-red-400' : 'border-slate-600 focus:border-teal-400'
                      }`}
                      placeholder="John"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-700 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:bg-slate-600 transition-colors duration-200 ${
                      errors.lastName ? 'border-red-400 focus:border-red-400' : 'border-slate-600 focus:border-teal-400'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-700 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:bg-slate-600 transition-colors duration-200 ${
                      errors.email ? 'border-red-400 focus:border-red-400' : 'border-slate-600 focus:border-teal-400'
                    }`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Business Name Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Business Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-700 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:bg-slate-600 transition-colors duration-200 ${
                      errors.businessName ? 'border-red-400 focus:border-red-400' : 'border-slate-600 focus:border-teal-400'
                    }`}
                    placeholder="My Business Inc."
                  />
                </div>
                {errors.businessName && (
                  <p className="text-red-400 text-sm mt-1">{errors.businessName}</p>
                )}
              </div>

              {/* Next Button */}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}

          {/* Step 2: Password & Terms */}
          {currentStep === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-lg font-semibold text-white mb-1">Secure Your Account</h2>
                <p className="text-slate-400 text-sm">Create a strong password and review our terms</p>
              </div>

              {errors.general && (
                <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-xl">
                  <p className="text-red-400 text-sm">{errors.general}</p>
                </div>
              )}

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 bg-slate-700 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:bg-slate-600 transition-colors duration-200 ${
                      errors.password ? 'border-red-400 focus:border-red-400' : 'border-slate-600 focus:border-teal-400'
                    }`}
                    placeholder="Create a strong password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength())}`}
                          style={{ width: `${(passwordStrength() / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-medium ${
                        passwordStrength() <= 2 ? 'text-red-400' : 
                        passwordStrength() <= 3 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {getStrengthText(passwordStrength())}
                      </span>
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 bg-slate-700 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:bg-slate-600 transition-colors duration-200 ${
                      errors.confirmPassword ? 'border-red-400 focus:border-red-400' : 'border-slate-600 focus:border-teal-400'
                    }`}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="w-4 h-4 text-teal-500 bg-slate-700 border-slate-600 rounded focus:ring-teal-500 mt-1"
                    disabled={isLoading}
                  />
                  <span className="ml-3 text-sm text-slate-300">
                    I agree to the{' '}
                    <Link to="/terms" className="text-teal-400 hover:text-teal-300 transition-colors duration-200">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-teal-400 hover:text-teal-300 transition-colors duration-200">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-red-400 text-sm">{errors.agreeToTerms}</p>
                )}

                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeToMarketing}
                    onChange={(e) => handleInputChange('agreeToMarketing', e.target.checked)}
                    className="w-4 h-4 text-teal-500 bg-slate-700 border-slate-600 rounded focus:ring-teal-500 mt-1"
                    disabled={isLoading}
                  />
                  <span className="ml-3 text-sm text-slate-300">
                    I'd like to receive product updates and marketing communications (optional)
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 px-6 py-3 border border-slate-600 text-slate-300 font-semibold rounded-xl hover:border-teal-400 hover:text-white transition-all duration-300"
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-teal-400 hover:text-teal-300 font-medium transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-slate-500 hover:text-slate-400 text-sm transition-colors duration-200"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;