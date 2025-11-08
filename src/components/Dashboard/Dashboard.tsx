import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Profile } from '../../lib/supabase';
import { Navbar } from '../Layout/Navbar';
import { SkillDirectory } from '../Directory/SkillDirectory';
import { PostBoard } from '../Board/PostBoard';
import { ProfileSetup } from '../Profile/ProfileSetup';
import { ProfileEdit } from '../Profile/ProfileEdit';

type ViewType = 'directory' | 'board' | 'profile';

export function Dashboard() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('directory');
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    checkProfile();
  }, [user]);

  const checkProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      setHasProfile(!!data);
    } catch (error) {
      console.error('Error checking profile:', error);
      setHasProfile(false);
    }
  };

  const handleProfileComplete = () => {
    setHasProfile(true);
  };

  const handleProfileSave = () => {
    setIsEditingProfile(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setCurrentView('directory');
    }
  };

  if (hasProfile === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!hasProfile) {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  if (isEditingProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          currentView={currentView}
          onViewChange={setCurrentView}
          onSearch={handleSearch}
        />
        <ProfileEdit
          onCancel={() => setIsEditingProfile(false)}
          onSave={handleProfileSave}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onSearch={handleSearch}
      />

      {currentView === 'directory' && <SkillDirectory searchQuery={searchQuery} />}
      {currentView === 'board' && <PostBoard />}
      {currentView === 'profile' && (
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
