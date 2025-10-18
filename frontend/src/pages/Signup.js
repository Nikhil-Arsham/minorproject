import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = ({ onSignup }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'name') {
      setFormData({ 
        ...formData, 
        name: value,
        username: value.toLowerCase().replace(/\s+/g, '')
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = {
      username: formData.username || formData.name.toLowerCase().replace(/\s+/g, ''),
      email: formData.email,
      password: formData.password,
      profile: { name: formData.name },
      role: formData.role
    };
    
    console.log('Signup form data being sent:', submitData);
    console.log('Role selected:', submitData.role);
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/register`, submitData);
      console.log('Registration response:', response.data);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      onSignup(response.data.user);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      setErrors({ general: error.response?.data?.error || 'Registration failed' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="bg-gradient-to-r from-secondary-600 to-secondary-700 rounded-2xl p-8 mb-8 shadow-2xl">
            <h2 className="text-4xl sm:text-5xl font-bold text-white">Create your account</h2>
            <p className="mt-4 text-lg sm:text-xl text-secondary-100">Join CodeArena and start coding</p>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 sm:py-10 px-6 sm:px-10 shadow-xl rounded-xl border border-primary-200 backdrop-blur-sm">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name || ''} 
                onChange={handleChange} 
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.name ? 'border-red-300' : 'border-gray-300'}`} 
                placeholder="Enter your full name" 
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email || ''} 
                onChange={handleChange} 
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.email ? 'border-red-300' : 'border-gray-300'}`} 
                placeholder="Enter your email" 
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password || ''} 
                onChange={handleChange} 
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.password ? 'border-red-300' : 'border-gray-300'}`} 
                placeholder="Enter your password" 
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                value={formData.confirmPassword || ''} 
                onChange={handleChange} 
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`} 
                placeholder="Confirm your password" 
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
              <select 
                id="role" 
                name="role" 
                value={formData.role} 
                onChange={handleChange} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-all duration-300 transform hover:scale-105"
              >
                Create Account
              </button>
            </div>
            {errors.general && <p className="text-sm text-red-600 text-center">{errors.general}</p>}
          </form>
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-sm text-gray-600">Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
