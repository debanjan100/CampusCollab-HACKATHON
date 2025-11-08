import React from "react"; // Add this import
import { useAuth } from "./contexts/AuthContext";
import { AuthPage } from "./components/Auth/AuthPage";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { ProfileSetup } from "./components/Profile/ProfileSetup";
import { supabase } from "./lib/supabase";

function App(): React.ReactElement {
  const { user, loading } = useAuth();
  const [needsProfileSetup, setNeedsProfileSetup] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      const checkProfile = async () => {
        try {
          // maybeSingle will return null data and no error when no rows found
          const { data, error } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", user.id)
            .maybeSingle();

          if (error) {
            // Log unexpected errors and assume profile missing only when data is null
            // so transient Supabase errors don't incorrectly gate the app.
            // Developers can check the console for details.
            // eslint-disable-next-line no-console
            console.error("Error checking profile:", error);
          }

          if (!data) {
            setNeedsProfileSetup(true);
          } else {
            setNeedsProfileSetup(false);
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("Unexpected error checking profile:", err);
          // If something unexpected happens, don't block the user — allow setup path.
          setNeedsProfileSetup(true);
        }
      };
      checkProfile();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (user) {
    if (needsProfileSetup) {
      return <ProfileSetup onComplete={() => setNeedsProfileSetup(false)} />;
    }
    return <Dashboard />;
  }

  return <AuthPage />;
}

export default App;
