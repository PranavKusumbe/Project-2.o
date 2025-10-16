import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Phone, UserPlus, GraduationCap, Users } from 'lucide-react';
import { authAPI } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    role: 'student',
    std: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.username || formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }
    if (formData.role === 'student' && !formData.std) {
      setError('Please select your standard');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      const dataToSend = { ...formData };
      delete dataToSend.confirmPassword;
      if (formData.role === 'teacher') {
        delete dataToSend.std;
      }
      
      await authAPI.register(dataToSend);
      navigate('/login', { 
        state: { message: 'Registration successful! Please login.' } 
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl mb-4 shadow-xl"
          >
            <GraduationCap size={40} className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
            MahaLearn
          </h1>
          <p className="text-gray-600">Create your account and start learning!</p>
        </div>

        {/* Register Card */}
        <Card className="backdrop-blur-lg bg-white/90">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-900">Register</h2>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'student', std: '' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.role === 'student'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Users className={`mx-auto mb-2 ${formData.role === 'student' ? 'text-primary-600' : 'text-gray-400'}`} />
                  <span className={`font-medium ${formData.role === 'student' ? 'text-primary-600' : 'text-gray-600'}`}>
                    Student
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'teacher' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.role === 'teacher'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <GraduationCap className={`mx-auto mb-2 ${formData.role === 'teacher' ? 'text-primary-600' : 'text-gray-400'}`} />
                  <span className={`font-medium ${formData.role === 'teacher' ? 'text-primary-600' : 'text-gray-600'}`}>
                    Teacher
                  </span>
                </button>
              </div>
            </div>

            <Input
              label="Username"
              name="username"
              icon={User}
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
            />

            {formData.role === 'student' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Standard
                </label>
                <select
                  name="std"
                  value={formData.std}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select your standard</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((std) => (
                    <option key={std} value={std}>
                      Standard {std}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Input
              label="Mobile Number"
              name="mobile"
              type="tel"
              icon={Phone}
              value={formData.mobile}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              maxLength={10}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              placeholder="Choose a strong password"
              required
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
            >
              <UserPlus size={20} />
              Create Account
            </Button>

            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          © 2025 MahaLearn. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
