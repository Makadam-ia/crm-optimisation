import LoginForm from './LoginForm';

export const metadata = {
  title: 'Connexion | Highgency CRM',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-500 mb-2">Highgency</h1>
          <p className="text-gray-500 dark:text-gray-400">Connectez-vous à votre espace artisan</p>
        </div>
        
        <LoginForm />
        
      </div>
    </div>
  );
}
