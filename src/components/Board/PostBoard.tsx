import { useState, useEffect } from 'react';
import { supabase, Post, Profile } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, Plus, Search, Filter, Calendar, User } from 'lucide-react';
import { CreatePost } from './CreatePost';

interface PostWithProfile extends Post {
  profile: Profile;
}

export function PostBoard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostWithProfile[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('open');

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchQuery, statusFilter]);

  const loadPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      const postsWithProfiles: PostWithProfile[] = (postsData || [])
        .map(post => {
          const profile = profiles?.find(p => p.id === post.user_id);
          return profile ? { ...post, profile } : null;
        })
        .filter((post): post is PostWithProfile => post !== null);

      setPosts(postsWithProfiles);
      setFilteredPosts(postsWithProfiles);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => post.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(query);
        const descMatch = post.description.toLowerCase().includes(query);
        const skillMatch = post.required_skills.some(skill =>
          skill.toLowerCase().includes(query)
        );
        return titleMatch || descMatch || skillMatch;
      });
    }

    setFilteredPosts(filtered);
  };

  const handlePostCreated = () => {
    setShowCreatePost(false);
    loadPosts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading posts...</div>
      </div>
    );
  }

  if (showCreatePost) {
    return (
      <CreatePost
        onCancel={() => setShowCreatePost(false)}
        onSuccess={handlePostCreated}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Project Board</h1>
          </div>
          <button
            onClick={() => setShowCreatePost(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            New Post
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts by title, description, or skills..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">No posts found</p>
          {searchQuery || statusFilter !== 'all' ? (
            <p className="text-gray-400">Try adjusting your filters</p>
          ) : (
            <button
              onClick={() => setShowCreatePost(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create the first post
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.status === 'open'
                          ? 'bg-green-100 text-green-800'
                          : post.status === 'in_progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : post.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {post.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.profile.full_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{post.description}</p>

                  {post.required_skills.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {post.required_skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
