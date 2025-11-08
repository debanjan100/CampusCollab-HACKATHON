# CampusCollab API Documentation

## Table of Contents

1. [Authentication API](#authentication-api)
2. [Profiles API](#profiles-api)
3. [Skills API](#skills-api)
4. [Types](#types)
5. [Error Handling](#error-handling)
6. [Real-time Subscriptions](#real-time-subscriptions)

## Authentication API

### Sign Up

Creates a new user account.

\`\`\`typescript
const signUp = async (email: string, password: string) => {
const { data, error } = await supabase.auth.signUp({
email,
password,
});
return { data, error };
};
\`\`\`

**Response:**

```typescript
{
  data: {
    user: User | null;
    session: Session | null;
  }
  error: AuthError | null;
}
```

### Sign In

Authenticates an existing user.

\`\`\`typescript
const signIn = async (email: string, password: string) => {
const { data, error } = await supabase.auth.signInWithPassword({
email,
password,
});
return { data, error };
};
\`\`\`

### Sign Out

Ends the current user session.

\`\`\`typescript
const signOut = async () => {
const { error } = await supabase.auth.signOut();
return { error };
};
\`\`\`

## Profiles API

### Create Profile

Creates a new user profile after registration.

\`\`\`typescript
const createProfile = async (profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) => {
const { data, error } = await supabase
.from('profiles')
.insert({
id: user?.id,
...profile
})
.select();
return { data, error };
};
\`\`\`

**Request Body:**
\`\`\`typescript
{
full_name: string;
department: string;
year: string;
bio?: string;
}
\`\`\`

### Get Profile

Retrieves a user's profile by ID.

\`\`\`typescript
const getProfile = async (userId: string) => {
const { data, error } = await supabase
.from('profiles')
.select('\*')
.eq('id', userId)
.single();
return { data, error };
};
\`\`\`

### Update Profile

Updates an existing profile.

\`\`\`typescript
const updateProfile = async (
userId: string,
updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
) => {
const { data, error } = await supabase
.from('profiles')
.update(updates)
.eq('id', userId)
.select();
return { data, error };
};
\`\`\`

## Skills API

### Add Skills

Adds one or more skills for a user.

\`\`\`typescript
const addSkills = async (skills: Omit<Skill, 'id' | 'created_at'>[]) => {
const { data, error } = await supabase
.from('skills')
.insert(skills)
.select();
return { data, error };
};
\`\`\`

**Request Body:**
\`\`\`typescript
{
user_id: string;
skill_name: string;
skill_type: 'have' | 'want';
}[]
\`\`\`

### Get User Skills

Retrieves all skills for a user.

\`\`\`typescript
const getUserSkills = async (userId: string) => {
const { data, error } = await supabase
.from('skills')
.select('\*')
.eq('user_id', userId);
return { data, error };
};
\`\`\`

### Delete Skill

Removes a skill from a user's profile.

\`\`\`typescript
const deleteSkill = async (skillId: string) => {
const { error } = await supabase
.from('skills')
.delete()
.eq('id', skillId);
return { error };
};
\`\`\`

## Types

### Database Types

\`\`\`typescript
interface Profile {
id: string;
full_name: string;
department: string;
year: string;
bio: string;
created_at: string;
updated_at: string;
}

interface Skill {
id: string;
user_id: string;
skill_name: string;
skill_type: 'have' | 'want';
created_at: string;
}
\`\`\`

### API Response Types

\`\`\`typescript
interface ApiResponse<T> {
data: T | null;
error: {
message: string;
code?: string;
details?: string;
} | null;
}

interface AuthResponse {
user: User | null;
session: Session | null;
error: AuthError | null;
}
\`\`\`

## Error Handling

### Error Codes

| Code     | Description      | Possible Cause              |
| -------- | ---------------- | --------------------------- |
| PGRST116 | Record not found | Query returned no results   |
| 401      | Unauthorized     | Invalid or expired JWT      |
| 403      | Forbidden        | RLS policy violation        |
| 409      | Conflict         | Unique constraint violation |

### Error Handling Example

\`\`\`typescript
const handleApiError = (error: any) => {
switch (error.code) {
case 'PGRST116':
return 'Resource not found';
case '401':
return 'Please sign in again';
case '403':
return 'You don\'t have permission to perform this action';
case '409':
return 'This record already exists';
default:
return 'An unexpected error occurred';
}
};

try {
const { data, error } = await supabase.from('profiles').select('\*');
if (error) throw error;
// Handle success
} catch (error) {
const message = handleApiError(error);
console.error('Error:', message);
}
\`\`\`

## Real-time Subscriptions

### Profile Changes

Subscribe to changes on the profiles table.

\`\`\`typescript
const subscribeToProfile = (userId: string, callback: (payload: any) => void) => {
const subscription = supabase
.channel('public:profiles')
.on('postgres_changes',
{
event: '\*',
schema: 'public',
table: 'profiles',
filter: \`id=eq.\${userId}\`
},
callback
)
.subscribe();

return subscription;
};
\`\`\`

### Skills Changes

Subscribe to changes on the skills table.

\`\`\`typescript
const subscribeToSkills = (userId: string, callback: (payload: any) => void) => {
const subscription = supabase
.channel('public:skills')
.on('postgres_changes',
{
event: '\*',
schema: 'public',
table: 'skills',
filter: \`user_id=eq.\${userId}\`
},
callback
)
.subscribe();

return subscription;
};
\`\`\`

## Rate Limits and Quotas

- Authentication: 1000 requests per hour
- Database operations: 100,000 rows per day
- Real-time connections: 200 concurrent connections

## Security Best Practices

1. Always use RLS policies
2. Never expose anon key in client-side code
3. Use parameterized queries
4. Validate input before sending to API
5. Handle errors gracefully with user-friendly messages

## API Versioning

Current API version: v1
Base URL: \`https://[project-ref].supabase.co\`

Changes to the API will be documented here with migration guides when necessary.
