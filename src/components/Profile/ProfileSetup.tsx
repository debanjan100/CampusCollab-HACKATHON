import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { User, Plus, X } from "lucide-react";

interface ProfileSetupProps {
  onComplete: () => void;
}

const DEPARTMENTS = [
  "Computer Science",
  "Engineering",
  "Business",
  "Arts",
  "Science",
  "Medicine",
  "Law",
  "Education",
  "Other",
];

const YEARS = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [bio, setBio] = useState("");
  const [skillsHave, setSkillsHave] = useState<string[]>([]);
  const [skillsWant, setSkillsWant] = useState<string[]>([]);
  const [currentSkillHave, setCurrentSkillHave] = useState("");
  const [currentSkillWant, setCurrentSkillWant] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addSkillHave = () => {
    if (
      currentSkillHave.trim() &&
      !skillsHave.includes(currentSkillHave.trim())
    ) {
      setSkillsHave([...skillsHave, currentSkillHave.trim()]);
      setCurrentSkillHave("");
    }
  };

  const addSkillWant = () => {
    if (
      currentSkillWant.trim() &&
      !skillsWant.includes(currentSkillWant.trim())
    ) {
      setSkillsWant([...skillsWant, currentSkillWant.trim()]);
      setCurrentSkillWant("");
    }
  };

  const removeSkillHave = (skill: string) => {
    setSkillsHave(skillsHave.filter((s) => s !== skill));
  };

  const removeSkillWant = (skill: string) => {
    setSkillsWant(skillsWant.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Log user and payload to help debug permission / payload issues
      // eslint-disable-next-line no-console
      console.log("Profile payload", {
        id: user?.id,
        full_name: fullName,
        department,
        year,
        bio: bio || "",
      });

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user?.id,
          full_name: fullName,
          department,
          year,
          bio: bio || "",
        })
        .select();

      if (profileError) {
        // eslint-disable-next-line no-console
        console.error("Profile insert error", profileError);
        setError(profileError.message ?? JSON.stringify(profileError));
        setLoading(false);
        return;
      }

      const skillsToInsert = [
        ...skillsHave.map((skill) => ({
          user_id: user?.id,
          skill_name: skill,
          skill_type: "have" as const,
        })),
        ...skillsWant.map((skill) => ({
          user_id: user?.id,
          skill_name: skill,
          skill_type: "want" as const,
        })),
      ];

      if (skillsToInsert.length > 0) {
        const { error: skillsError } = await supabase
          .from("skills")
          .insert(skillsToInsert)
          .select();

        if (skillsError) {
          // eslint-disable-next-line no-console
          console.error("Skills insert error", skillsError);
          setError(skillsError.message ?? JSON.stringify(skillsError));
          setLoading(false);
          return;
        }
      }

      // Success
      onComplete();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Unexpected error creating profile", err);
      setError(err instanceof Error ? err.message : JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center mb-6">
          <User className="w-8 h-8 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">
            Complete Your Profile
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Department *
              </label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Year *
              </label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Year</option>
                {YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us about yourself..."
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
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSkillHave())
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., React, Python, Design"
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
              {skillsHave.map((skill) => (
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
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSkillWant())
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Machine Learning, Public Speaking"
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
              {skillsWant.map((skill) => (
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Creating Profile..." : "Complete Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
