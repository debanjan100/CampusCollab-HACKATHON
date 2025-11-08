import { Link } from 'react-router-dom';
import { Users, Search, Briefcase, Award, ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';

const Home = () => {
  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Skill Profiles",
      description: "Create your profile and showcase skills you have while listing what you want to learn"
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Project Board",
      description: "Post projects, find teammates, or offer help - all in one collaborative space"
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Smart Search",
      description: "Instantly find peers by skills, department, or project needs across campus"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Endorsements",
      description: "Build reputation through skill endorsements from peers and collaborators"
    }
  ];

  const stats = [
    { icon: <Users />, value: "1000+", label: "Active Students" },
    { icon: <Briefcase />, value: "500+", label: "Projects Created" },
    { icon: <Target />, value: "2000+", label: "Skills Shared" },
    { icon: <TrendingUp />, value: "95%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold">
              <Zap className="h-4 w-4 mr-2" />
              Connecting & Amplifying Growth
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 text-balance">
            Your Campus
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent"> LinkedIn</span>
            <br />
            For Collaboration
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-balance">
            Break down talent silos. Find project partners, tutors, and collaborators instantly. 
            Make campus collaboration magically efficient.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition transform hover:scale-105 shadow-lg"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-600 bg-white rounded-lg hover:bg-gray-50 transition border-2 border-primary-600"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Collaborate
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to connect students and foster meaningful collaborations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl shadow-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Collaborating?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of students already using CampusCollab to build amazing projects
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-primary-600 bg-white rounded-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-lg"
          >
            Create Your Profile
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-8 w-8 text-primary-400" />
                <span className="text-2xl font-bold text-white">CampusCollab</span>
              </div>
              <p className="text-gray-400">
                Connecting and amplifying growth across campus communities.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Team Quad-Coders</h3>
              <ul className="space-y-2 text-sm">
                <li>Debanjan Ghorui (Team Lead)</li>
                <li>Ananya Ray</li>
                <li>Asmit Roy</li>
                <li>Ayan Hait</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/login" className="hover:text-primary-400 transition">Login</Link></li>
                <li><Link to="/register" className="hover:text-primary-400 transition">Register</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2024 CampusCollab by Quad-Coders. Built for HACK-ULA Hackathon.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;