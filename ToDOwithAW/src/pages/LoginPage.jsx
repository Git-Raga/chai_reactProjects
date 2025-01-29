import React, { useState } from 'react';
import db from "../appwrite/database";
import { databases } from "../appwrite/config";
import { Query } from 'appwrite';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [isAnimating, setIsAnimating] = useState(true);
 const [error, setError] = useState('');
 const navigate = useNavigate();

 const adminUsers = [
   'suresh.k@salesforce.com',
   'rkrishnamurthy1@salesforce.com', 
   'mprathaban@salesforce.com',
   'marena@salesforce.com'
 ];

 React.useEffect(() => {
   const interval = setInterval(() => {
     setIsAnimating(prev => !prev);
   }, 1500);
   return () => clearInterval(interval);
 }, []);
 
 
 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const response = await databases.listDocuments(
      import.meta.env.VITE_DATABASE_ID,
      '672f8386001eb724f220',
      [
        Query.equal('email', email)
      ]
    );

    const user = response.documents.find(doc => doc.password === password);
    
    if (user) {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isAdmin', adminUsers.includes(email));
      window.location.href = adminUsers.includes(email) ? '/notes' : '/usernotes';
    } else {
      setError('Invalid credentials. Please contact Administrator.');
    }
  } catch (error) {
    console.error('Login error:', error);
    setError('System error. Please contact Administrator.');
  }
};






return (
   <div className="min-h-screen flex items-center justify-center bg-gray-900 font-titillium">
     <div className="w-full max-w-md p-6 space-y-10 bg-gray-800 rounded-lg shadow-xl">
       <div className="text-center">
         <div className="flex items-center justify-center space-x-2">
           <h1 className="text-4xl font-bold text-white">TaskForce</h1>
           <span className={`text-2xl ${isAnimating ? 'opacity-100' : 'opacity-50'} transition-opacity duration-500`}>
             ⚡
           </span>
         </div>
         <p className="mt-1 text-sm text-gray-400">
           <b>Every task</b> assigned to you is an <b>Opportunity</b>
         </p>
       </div>

       <div className="space-y-12">
         <form className="space-y-8" onSubmit={handleSubmit}>
           <div className="space-y-6">
             <div>
               <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                 Email
               </label>
               <input
                 id="email"
                 type="email"
                 required
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                 placeholder="Enter your email"
               />
             </div>

             <div className='mb-20'>
               <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                 Password
               </label>
               <input
                 id="password"
                 type="password"
                 required
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                 placeholder="Enter your password"
               />
             </div>

             {error && (
               <div className="text-red-900 text-center p-2 bg-red-100 bg-opacity-90 rounded">
                 {error}
               </div>
             )}

             <button
               type="submit"
               className="w-full flex justify-center py-3 px-4 border-2 rounded-md shadow-sm text-sm font-medium text-white bg-teal-700 hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
             >
               Sign in
             </button>
           </div>
         </form>
       </div>
     </div>
   </div>
 );
};

export default LoginPage;