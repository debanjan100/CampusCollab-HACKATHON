import { useState, useEffect } from 'react';
import { supabase, Profile, Skill } from '../../lib/supabase';
import { Search, Users, Filter, Mail } from 'lucide-react';

interface UserWithSkills extends Profile {
  skills: Skill[];
}

interface SkillDirectoryProps {
  searchQuery?: string;
}

const DEPARTMENTS = [
  'All',
  'Computer Science',
  'Engineering',
  'Business',
  'Arts',
  'Science',
  'Medicine',
  'Law',
  'Education',
  'Other'
];

export function SkillDirectory({ searchQuery = '' }: SkillDirectoryProps) {
  const [users, setUsers] = useState<UserWithSkills[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithSkills[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [skillFilter, setSkillFilter] = useState<'all' | 'have' | 'want'>('all');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, selectedDepartment, localSearchQuery, skillFilter, searchQuery]);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const loadUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: skills, error: skillsError } = await supabase
        .from('skills')
        .select('*');

      if (skillsError) throw skillsError;

      const usersWithSkills: UserWithSkills[] = (profiles || []).map(profile => ({
        ...profile,
        skills: (skills || []).filter(skill => skill.user_id === profile.id),
      }));

      setUsers(usersWithSkills);
      setFilteredUsers(usersWithSkills);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (selectedDepartment !== 'All') {
      filtered = filtered.filter(user => user.department === selectedDepartment);
    }

    const query = (localSearchQuery || searchQuery).toLowerCase();
    if (query) {
      filtered = filtered.filter(user => {
        const nameMatch = user.full_name.toLowerCase().includes(query);
        const bioMatch = user.bio.toLowerCase().includes(query);
        const skillMatch = user.skills.some(skill =>
          skill.skill_name.toLowerCase().includes(query)
        );
        return nameMatch || bioMatch || skillMatch;
      });
    }

    if (skillFilter !== 'all') {
      filtered = filtered.filter(user =>
        user.skills.some(skill => skill.skill_type === skillFilter)
      );
    }

    setFilteredUsers(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading directory...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Skill Directory</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                placeholder="Search by name, skill, or bio..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSkillFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              skillFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Skills
          </button>
          <button
            onClick={() => setSkillFilter('have')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              skillFilter === 'have'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Can Help With
          </button>
          <button
            onClick={() => setSkillFilter('want')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              skillFilter === 'want'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Want to Learn
          </button>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No users found matching your criteria</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => {
            const skillsHave = user.skills.filter(s => s.skill_type === 'have');
            const skillsWant = user.skills.filter(s => s.skill_type === 'want');

            return (
              <div key={user.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{user.full_name}</h3>
                    <p className="text-sm text-gray-600">{user.department}</p>
                    <p className="text-sm text-gray-500">{user.year}</p>
                  </div>
                </div>

                {user.bio && (
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{user.bio}</p>
                )}

                {skillsHave.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Can Help With:</p>
                    <div className="flex flex-wrap gap-1">
                      {skillsHave.slice(0, 3).map(skill => (
                        <span
                          key={skill.id}
                          className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                        >
                          {skill.skill_name}
                        </span>
                      ))}
                      {skillsHave.length > 3 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{skillsHave.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {skillsWant.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Wants to Learn:</p>
                    <div className="flex flex-wrap gap-1">
                      {skillsWant.slice(0, 3).map(skill => (
                        <span
                          key={skill.id}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                        >
                          {skill.skill_name}
                        </span>
                      ))}
                      {skillsWant.length > 3 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{skillsWant.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
