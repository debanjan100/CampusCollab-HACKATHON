import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, LogOut, User, Search, Briefcase } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              CampusCollab
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition">
                  Dashboard
                </Link>
                <Link to="/search" className="flex items-center text-gray-700 hover:text-primary-600 transition">
                  <Search className="h-5 w-5 mr-1" />
                  Search
                </Link>
                <Link to="/projects" className="flex items-center text-gray-700 hover:text-primary-600 transition">
                  <Briefcase className="h-5 w-5 mr-1" />
                  Projects
                </Link>
                <Link to="/profile" className="flex items-center text-gray-700 hover:text-primary-600 transition">
                  <User className="h-5 w-5 mr-1" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-red-600 transition"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;