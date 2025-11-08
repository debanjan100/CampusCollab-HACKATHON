import { useState, useEffect } from 'react';
import { projectsAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import { Plus, X, Briefcase, Users, Clock, Tag } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'project',
    category: 'technical',
    skillsNeeded: [],
    teamSize: 2,
    duration: ''
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await projectsAPI.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectsAPI.create(formData);
      setShowModal(false);
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleInterest = async (projectId) => {
    try {
      await projectsAPI.expressInterest(projectId);
      fetchProjects();
    } catch (error) {
      console.error('Failed to express interest:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'project',
      category: 'technical',
      skillsNeeded: [],
      teamSize: 2,
      duration: ''
    });
    setNewSkill('');
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skillsNeeded.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skillsNeeded: [...formData.skillsNeeded, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    const updated = [...formData.skillsNeeded];
    updated.splice(index, 1);
    setFormData({ ...formData, skillsNeeded: updated });
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects & Help Board</h1>
            <p className="text-gray-600">Find projects or post what you need</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Project
          </button>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div key={project._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {project.type}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">{project.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>

                {project.skillsNeeded && project.skillsNeeded.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2 flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      Skills Needed:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.skillsNeeded.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Team: {project.teamSize || 'Flexible'}
                  </span>
                  {project.duration && (
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {project.duration}
                    </span>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {project.creator?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{project.creator?.name}</p>
                        <p className="text-xs text-gray-500">{project.creator?.department}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {project.interestedUsers?.length || 0} interested
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleInterest(project._id)}
                    className="w-full px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition font-medium"
                  >
                    Express Interest
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No projects yet. Be the first to create one!</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Create Project
            </button>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Project title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe your project or what help you need..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="project">Project</option>
                    <option value="help">Need Help</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="tutoring">Tutoring</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="technical">Technical</option>
                    <option value="academic">Academic</option>
                    <option value="creative">Creative</option>
                    <option value="research">Research</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="club">Club</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                  <input
                    type="number"
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) })}
                    min="1"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 2 weeks, 1 month"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills Needed</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Add a skill..."
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skillsNeeded.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full flex items-center">
                      {skill}
                      <button type="button" onClick={() => removeSkill(idx)} className="ml-2">
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;