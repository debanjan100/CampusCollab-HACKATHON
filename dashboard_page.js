import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI, projectsAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import { Users, Briefcase, Target, TrendingUp, Plus, Search as SearchIcon } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ users: 0, projects: 0, skills: 0 });
  const [recentProjects, setRecentProjects] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, projectsRes] = await Promise.all([
        usersAPI.getAll(),
        projectsAPI.getAll({ status: 'open' })
      ]);

      setStats({
        users: usersRes.data.length,
        projects: projectsRes.data.length,
        skills: user?.skillsHave?.length || 0
      });

      setRecentProjects(projectsRes.data.slice(0, 4));
      
      // Find users with skills we want
      if (user?.skillsWant?.length > 0) {
        const matches = usersRes.data.filter(u => 
          u._id !== user.id && 
          u.skillsHave.some(skill => user.skillsWant.includes(skill))
        ).slice(0, 4);
        setSuggestedUsers(matches);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Here's what's happening on campus</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.users}</p>
              </div>
              <Users className="h-12 w-12 text-primary-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Open Projects</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.projects}</p>
              </div>
              <Briefcase className="h-12 w-12 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Your Skills</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.skills}</p>
              </div>
              <Target className="h-12 w-12 text-green-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/projects"
            className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Create New Project</h3>
                <p className="text-primary-100">Start collaborating with peers</p>
              </div>
              <Plus className="h-10 w-10" />
            </div>
          </Link>

          <Link
            to="/search"
            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Find Collaborators</h3>
                <p className="text-purple-100">Search by skills and interests</p>
              </div>
              <SearchIcon className="h-10 w-10" />
            </div>
          </Link>
        </div>

        {/* Recent Projects */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recent Projects</h2>
            <Link to="/projects" className="text-primary-600 hover:text-primary-700 font-medium">
              View All
            </Link>
          </div>
          
          {recentProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {recentProjects.map(project => (
                <div key={project._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                      {project.type}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skillsNeeded?.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>By {project.creator?.name}</span>
                    <span>{project.interestedUsers?.length || 0} interested</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No projects yet. Be the first to create one!</p>
            </div>
          )}
        </div>

        {/* Suggested Connections */}
        {suggestedUsers.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Suggested Connections</h2>
              <Link to="/search" className="text-primary-600 hover:text-primary-700 font-medium">
                View More
              </Link>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {suggestedUsers.map(suggestedUser => (
                <Link
                  key={suggestedUser._id}
                  to={`/profile/${suggestedUser._id}`}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                    {suggestedUser.name.charAt(0)}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{suggestedUser.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{suggestedUser.department}</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {suggestedUser.skillsHave?.slice(0, 2).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;