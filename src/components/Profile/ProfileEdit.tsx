import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Profile, Skill } from '../../lib/supabase';
import { User, Plus, X, Save } from 'lucide-react';

interface ProfileEditProps {
  onCancel: () => void;
  onSave: () => void;
}

const DEPARTMENTS = [
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

const YEARS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];

export function ProfileEdit({ onCancel, onSave }: ProfileEditProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [bio, setBio] = useState('');
  const [skillsHave, setSkillsHave] = useState<string[]>([]);
  const [skillsWant, setSkillsWant] = useState<string[]>([]);
  const [currentSkillHave, setCurrentSkillHave] = useState('');
  const [currentSkillWant, setCurrentSkillWant] = useState('');

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (profile) {
        setFullName(profile.full_name);
        setDepartment(profile.department);
        setYear(profile.year);
        setBio(profile.bio || '');
      }

      const { data: skills, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user.id);

      if (skillsError) throw skillsError;

      if (skills) {
        setSkillsHave(skills.filter(s => s.skill_type === 'have').map(s => s.skill_name));
        setSkillsWant(skills.filter(s => s.skill_type === 'want').map(s => s.skill_name));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const addSkillHave = () => {
    if (currentSkillHave.trim() && !skillsHave.includes(currentSkillHave.trim())) {
      setSkillsHave([...skillsHave, currentSkillHave.trim()]);
      setCurrentSkillHave('');
    }
  };

  const addSkillWant = () => {
    if (currentSkillWant.trim() && !skillsWant.includes(currentSkillWant.trim())) {
      setSkillsWant([...skillsWant, currentSkillWant.trim()]);
      setCurrentSkillWant('');
    }
  };

  const removeSkillHave = (skill: string) => {
    setSkillsHave(skillsHave.filter(s => s !== skill));
  };

  const removeSkillWant = (skill: string) => {
    setSkillsWant(skillsWant.filter(s => s !== skill));
  };

  const handleSave = async () => {
    if (!user) return;

    setError('');
    setSaving(true);

    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          department,
          year,
          bio: bio || '',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      await supabase.from('skills').delete().eq('user_id', user.id);

      const skillsToInsert = [
        ...skillsHave.map(skill => ({
          user_id: user.id,
          skill_name: skill,
          skill_type: 'have' as const,
        })),
        ...skillsWant.map(skill => ({
          user_id: user.id,
          skill_name: skill,
          skill_type: 'want' as const,
        })),
      ];

      if (skillsToInsert.length > 0) {
        const { error: skillsError } = await supabase
          .from('skills')
          .insert(skillsToInsert);

        if (skillsError) throw skillsError;
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <User className="w-8 h-8 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
          </div>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {YEARS.map(yr => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills I Have
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentSkillHave}
                onChange={(e) => setCurrentSkillHave(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillHave())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addSkillHave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsHave.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                  <button type="button" onClick={() => removeSkillHave(skill)}>
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills I Want to Learn
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentSkillWant}
                onChange={(e) => setCurrentSkillWant(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillWant())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addSkillWant}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsWant.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                  <button type="button" onClick={() => removeSkillWant(skill)}>
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={onCancel}
              disabled={saving}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
