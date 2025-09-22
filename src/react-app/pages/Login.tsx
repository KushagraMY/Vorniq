import { useState } from 'react';
// Firebase imports
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/react-app/firebaseConfig';
import { useUser } from '@/react-app/hooks/useUser';

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
      <g>
        <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.7 30.77 0 24 0 14.82 0 6.73 5.82 2.69 14.09l7.98 6.19C12.36 13.13 17.74 9.5 24 9.5z"/>
        <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.66 7.01l7.19 5.6C43.98 37.13 46.1 31.36 46.1 24.55z"/>
        <path fill="#FBBC05" d="M10.67 28.28A14.5 14.5 0 019.5 24c0-1.49.25-2.93.67-4.28l-7.98-6.19A23.94 23.94 0 000 24c0 3.77.9 7.34 2.69 10.47l7.98-6.19z"/>
        <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.15 15.9-5.85l-7.19-5.6c-2.01 1.35-4.59 2.15-8.71 2.15-6.26 0-11.64-3.63-13.33-8.81l-7.98 6.19C6.73 42.18 14.82 48 24 48z"/>
        <path fill="none" d="M0 0h48v48H0z"/>
      </g>
    </svg>
  );
}

const provider = new GoogleAuthProvider();

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Use Firebase email/password authentication
      const result = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = result.user;
      
      const userObj = {
        email: user.email || '',
        name: user.displayName || user.email?.split('@')[0] || 'User',
        id: user.uid,
        photoURL: user.photoURL || ''
      };
      
      login(userObj);
      window.location.href = '/';
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        default:
          setError('Login failed. Please check your credentials and try again.');
      }
    }
    
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userObj = {
        email: user.email || '',
        name: user.displayName || '',
        id: user.uid,
        photoURL: user.photoURL || ''
      };
      login(userObj);
      window.location.href = '/';
    } catch {
      setError('Google login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">Login to VorniQ</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-colors"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="my-4 flex items-center justify-center gap-2">
          <span className="h-px w-10 bg-gray-300" />
          <span className="text-gray-400 text-sm">or</span>
          <span className="h-px w-10 bg-gray-300" />
        </div>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 py-3 rounded-lg font-semibold text-gray-700 transition-colors"
          disabled={loading}
        >
          <GoogleIcon /> {loading ? 'Signing in...' : 'Login with Google'}
        </button>
        <div className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account? <a href="/signup" className="text-primary font-semibold hover:underline">Sign Up</a>
        </div>
      </div>
    </div>
  );
} 