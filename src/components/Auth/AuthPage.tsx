import { useState } from 'react';
import { Login } from './Login';
import { Register } from './Register';
import { Users } from 'lucide-react';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start mb-6">
            <Users className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            CampusCollab
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Connect with peers, share skills, and collaborate on projects
          </p>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <p className="text-gray-700">Find students with the skills you need</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-semibold">2</span>
              </div>
              <p className="text-gray-700">Share your expertise and help others</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-semibold">3</span>
              </div>
              <p className="text-gray-700">Collaborate on meaningful projects</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          {isLogin ? (
            <Login onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <Register
              onSwitchToLogin={() => setIsLogin(true)}
              onRegistrationSuccess={() => setIsLogin(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
