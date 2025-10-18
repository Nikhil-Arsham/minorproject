import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ isLoggedIn, userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/logout');
  };

  // NavLink component with active state
  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-primary-600 text-white'
            : 'text-gray-300 hover:bg-primary-700 hover:text-white'
        }`}
      >
        {children}
      </Link>
    );
  };

  // Mobile NavLink component
  const MobileNavLink = ({ to, children, onClick }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-primary-600/20 text-primary-400'
            : 'text-gray-300 hover:bg-primary-800 hover:text-white'
        }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className="w-full bg-primary-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 group"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                <span className="text-white font-bold text-sm">CA</span>
              </div>
              <span className="text-xl font-bold text-primary-300">
                CodeArena
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-1">
            <NavLink to="/">Home</NavLink>
            
            {isLoggedIn ? (
              <>
                <NavLink to="/contests">Contests</NavLink>
                <NavLink to="/leaderboard">Leaderboard</NavLink>
                <NavLink to="/dashboard">Dashboard</NavLink>
                {userRole === 'admin' && (
                  <NavLink to="/admin">Admin Panel</NavLink>
                )}
                <NavLink to="/profile">Profile</NavLink>
                <NavLink to="/problems">Problems</NavLink>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-4 py-2 text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 focus:ring-offset-primary-900 transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <Link
                  to="/signup"
                  className="ml-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-primary-900"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-2 pt-2 pb-4 space-y-1">
          <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </MobileNavLink>
          
          {isLoggedIn ? (
            <>
              <MobileNavLink to="/contests" onClick={() => setIsMobileMenuOpen(false)}>
                Contests
              </MobileNavLink>
              <MobileNavLink to="/leaderboard" onClick={() => setIsMobileMenuOpen(false)}>
                Leaderboard
              </MobileNavLink>
              <MobileNavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                Dashboard
              </MobileNavLink>
              {userRole === 'admin' && (
                <MobileNavLink to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                  Admin Panel
                </MobileNavLink>
              )}
              <MobileNavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                Profile
              </MobileNavLink>
              <MobileNavLink to="/problems" onClick={() => setIsMobileMenuOpen(false)}>
                Problems
              </MobileNavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-base font-medium text-secondary-400 hover:bg-secondary-800 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <MobileNavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                Login
              </MobileNavLink>
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full mt-2 px-4 py-3 text-center text-base font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
