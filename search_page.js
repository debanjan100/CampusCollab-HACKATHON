import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import { Search as SearchIcon, Filter, Users, Award } from 'lucide-react';

const Search = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    year: '',
    skill: ''
  });

  const departments = [
    'All', 'Computer Science', 'Information Science', 'Electronics',
    'Mechanical', 'Civil', 'Electrical', 'Biotechnology', 'Chemical', 'Other'
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, filters, users]);

  const fetchUsers = async () => {
    try {
      const { data } = await usersAPI.getAll();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.skillsHave.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filters.department && filters.department !== 'All') {
      filtered = filtered.filter(user => user.department === filters.department);
    }

    if (filters.year) {
      filtered = filtered.filter(user => user.year === parseInt(filters.year));
    }

    if (filters.skill) {
      filtered = filtered.filter(user =>
        user.skillsHave.some(skill => 
          skill.toLowerCase().includes(filters.skill.toLowerCase())
        )
      );
    }

    setFilteredUsers(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Collaborators</h1>
          <p className="text-gray-600">Search for students by skills, department, or name</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="relative mb-4">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, department, or skills..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept === 'All' ? '' : dept}>{dept}</option>
              ))}
            </select>

            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>

            <input
              type="text"
              value={filters.skill}
              onChange={(e) => handleFilterChange('skill', e.target.value)}
              placeholder="Filter by skill..."
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />

            {(filters.department || filters.year || filters.skill || searchTerm) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ department: '', year: '', skill: '' });
                }}
                className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Found <span className="font-semibold text-gray-900">{filteredUsers.length}</span> students
          </p>
        </div>

        {filteredUsers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map(user => (
              <Link
                key={user._id}
                to={`/profile/${user._id}`}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user.name.charAt(0)}
                  </div>
                  {user.reputation > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs">
                      <Award className="h-3 w-3" />
                      {user.reputation}
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-1">{user.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{user.usn}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {user.department} • Year {user.year}
                </p>

                {user.skillsHave && user.skillsHave.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {user.skillsHave.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {user.skillsHave.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{user.skillsHave.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {user.skillsWant && user.skillsWant.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-700 mb-2">Wants to learn:</p>
                    <div className="flex flex-wrap gap-1">
                      {user.skillsWant.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No users found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;