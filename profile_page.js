import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import { Mail, Phone, Linkedin, Github, Edit, Plus, X, Award, MapPin, Calendar } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [newSkillHave, setNewSkillHave] = useState('');
  const [newSkillWant, setNewSkillWant] = useState('');

  const isOwnProfile = !id || id === currentUser?.id;

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      if (isOwnProfile) {
        const { data } = await usersAPI.getById(currentUser.id);
        setProfile(data);
        setFormData(data);
      } else {
        const { data } = await usersAPI.getById(id);
        setProfile(data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { data } = await usersAPI.updateProfile(formData);
      setProfile(data);
      updateUser(data);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const addSkill = (type) => {
    const skill = type === 'have' ? newSkillHave : newSkillWant;
    if (!skill.trim()) return;

    const field = type === 'have' ? 'skillsHave' : 'skillsWant';
    setFormData({
      ...formData,
      [field]: [...(formData[field] || []), skill.trim()]
    });
    
    if (type === 'have') setNewSkillHave('');
    else setNewSkillWant('');
  };

  const removeSkill = (type, index) => {
    const field = type === 'have' ? 'skillsHave' : 'skillsWant';
    const updated = [...formData[field]];
    updated.splice(index, 1);
    setFormData({ ...formData, [field]: updated });
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 h-32"></div>
          
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-16 mb-4">
              <div className="flex items-end space-x-4">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-5xl font-bold text-primary-600 border-4 border-white shadow-lg">
                  {profile?.name?.charAt(0)}
                </div>
                <div className="mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{profile?.name}</h1>
                  <p className="text-gray-600">{profile?.usn}</p>
                </div>
              </div>
              
              {isOwnProfile && (
                <button
                  onClick={() => editing ? handleUpdateProfile() : setEditing(true)}
                  className="mb-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center"
                >
                  {editing ? 'Save Profile' : <><Edit className="h-4 w-4 mr-2" /> Edit Profile</>}
                </button>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-5 w-5 mr-2" />
                  {editing ? (
                    <input
                      type="text"
                      value={formData.department || ''}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="flex-1 px-3 py-1 border rounded"
                      placeholder="Department"
                    />
                  ) : (
                    <span>{profile?.department}</span>
                  )}
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="h-5 w-5 mr-2" />
                  {editing ? (
                    <select
                      value={formData.year || 1}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      className="flex-1 px-3 py-1 border rounded"
                    >
                      <option value={1}>1st Year</option>
                      <option value={2}>2nd Year</option>
                      <option value={3}>3rd Year</option>
                      <option value={4}>4th Year</option>
                    </select>
                  ) : (
                    <span>Year {profile?.year}</span>
                  )}
                </div>
                <div className="flex items-center text-gray-600">
                  <Award className="h-5 w-5 mr-2" />
                  <span>Reputation: {profile?.reputation || 0}</span>
                </div>
              </div>

              <div>
                {profile?.email && (
                  <div className="flex items-center text-gray-600 mb-2">
                    <Mail className="h-5 w-5 mr-2" />
                    <span>{profile.email}</span>
                  </div>
                )}
                {profile?.contact?.phone && (
                  <div className="flex items-center text-gray-600 mb-2">
                    <Phone className="h-5 w-5 mr-2" />
                    <span>{profile.contact.phone}</span>
                  </div>
                )}
                {profile?.contact?.linkedin && (
                  <div className="flex items-center text-gray-600 mb-2">
                    <Linkedin className="h-5 w-5 mr-2" />
                    <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      LinkedIn
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
              {editing ? (
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg"
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-600">{profile?.bio || 'No bio added yet.'}</p>
              )}
            </div>

            {/* Skills Have */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Skills I Have</h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {(editing ? formData.skillsHave : profile?.skillsHave)?.map((skill, idx) => (
                  <span key={idx} className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium flex items-center">
                    {skill}
                    {editing && (
                      <button onClick={() => removeSkill('have', idx)} className="ml-2">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {editing && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillHave}
                    onChange={(e) => setNewSkillHave(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill('have')}
                    placeholder="Add a skill..."
                    className="flex-1 px-4 py-2 border rounded-lg"
                  />
                  <button
                    onClick={() => addSkill('have')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Skills Want */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Skills I Want to Learn</h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {(editing ? formData.skillsWant : profile?.skillsWant)?.map((skill, idx) => (
                  <span key={idx} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium flex items-center">
                    {skill}
                    {editing && (
                      <button onClick={() => removeSkill('want', idx)} className="ml-2">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {editing && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillWant}
                    onChange={(e) => setNewSkillWant(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill('want')}
                    placeholder="Add a skill you want to learn..."
                    className="flex-1 px-4 py-2 border rounded-lg"
                  />
                  <button
                    onClick={() => addSkill('want')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;