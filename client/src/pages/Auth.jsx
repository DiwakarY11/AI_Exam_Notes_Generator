import React from 'react';
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from "axios";
import { serverUrl } from '../App';

function Auth() {

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const User = response.user;
      const name = User.displayName;
      const email = User.email;
      
      const result = await axios.post(serverUrl + "/api/auth/google", { name, email }, {
        withCredentials: true
      });
      
      console.log("Login Success:", result.data);
      
      // Force the page to reload so App.jsx refetches the current user
      // OR dispatch your Redux action here!
      window.location.href = "/"; 
      
    } catch (error) {
      console.log("Firebase Error:", error);
    }
  }
  return (
    <div className='min-h-screen overflow-hidden bg-white text-black px-8'>
      
      {/* HEADER */}
      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="max-w-7xl mx-auto mt-8
        rounded-xl
        bg-[#333333]
        border border-black/5
        px-8 py-5
        shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
      >
        <h1 className='text-xl font-bold text-white tracking-wide'>
          ExamNotes AI
        </h1>
        <p className='text-xs text-gray-300 mt-1 font-light tracking-wide'>
          AI-powered exam-oriented notes & revision
        </p>
      </motion.header>

      {/* MAIN CONTENT */}
      <main className='max-w-7xl mx-auto py-16 grid grid-cols-1 lg:grid-cols-2 items-center gap-10'>
        
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="flex flex-col items-start"
        >
          {/* Main Heading */}
          <h1 className='text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight bg-gradient-to-br from-neutral-700 via-neutral-600 to-neutral-700 bg-clip-text text-transparent'>
            Unlock Smart <br /> AI Notes
          </h1>
          
          {/* Google Button */}
          <motion.button
            onClick={handleGoogleAuth}
            whileHover={{
              y: -5,
              rotateX: 5,
              rotateY: -5,
              scale: 1.05
            }}
            whileTap={{ scale: 0.97 }}
            className='mt-8 px-8 py-3.5 rounded-xl flex items-center gap-3
            bg-[#1f1f1f] border border-white/10
            text-white font-medium text-sm
            shadow-[0_15px_30px_rgba(0,0,0,0.4)]
            hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-shadow'
          >
            <FcGoogle size={20} />
            Continue with Google
          </motion.button>
          
          {/* Description Text */}
          <p className='mt-8 max-w-md text-sm text-gray-500 leading-relaxed'>
            You get <span className="font-semibold text-gray-700">50 FREE credits</span> to create exam notes, project notes, charts, graphs and download clean PDFs — instantly using AI.
          </p>

          {/* Sub-footer Text */}
          <p className='mt-4 text-xs text-gray-400 font-medium tracking-wide'>
            Start with 50 free credits • Upgrade anytime for more credits • Instant access
          </p>
          
        </motion.div>

        {/* RIGHT CONTENT */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
          <Feature 
            icon="🎁" 
            title="50 Free Credits" 
            des="Start with 50 credits to generate notes without paying." 
          />
          <Feature 
            icon="📘" 
            title="Exam Notes" 
            des="High-yield, revision-ready exam-oriented notes." 
          />
          <Feature 
            icon="📁" 
            title="Project Notes" 
            des="Well-structured documentation for assignments & projects." 
          />
          <Feature 
            icon="📊" 
            title="Charts & Graphs" 
            des="Auto-generated diagrams, charts and flow graphs." 
          />
          <Feature 
            icon="⬇️" 
            title="Free PDF Download" 
            des="Download clean, instantly." 
          />
        </div>
        
      </main>
    </div>
  );
}

function Feature({ icon, title, des }) {
  return (
    <motion.div
      whileHover={{ y: -12, rotateX: 8, rotateY: -8, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className='relative rounded-2xl p-6
      bg-gradient-to-br from-black/90 via-black/80 to-black/90
      backdrop-blur-2xl
      border border-white/10
      shadow-[0_30px_80px_rgba(0,0,0,0.7)]
      text-white'
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className='absolute inset-0 rounded-2xl
      bg-gradient-to-br from-white/10 to-transparent
      opacity-0 hover:opacity-100 transition-opacity
      pointer-events-none'>
      </div>

      <div className='relative z-10' style={{ transform: "translateZ(30px)" }}>
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{des}</p>
      </div>
      
    </motion.div>
  );
}

export default Auth;