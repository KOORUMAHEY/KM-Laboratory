
"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

interface Skill {
  name: string;
  description: string;
  logo: string;
  url: string;
}

// Mock data
const skills = [
  {
    name: 'React',
    description: 'Expert in building reactive UI',
    logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg',
    url: 'https://reactjs.org',
  },
  {
    name: 'Next.js',
    description: 'Server-side rendering & static sites',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
    url: 'https://nextjs.org',
  },
  {
    name: 'TypeScript',
    description: 'Type safe JavaScript',
    logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg',
    url: 'https://www.typescriptlang.org',
  },
  {
    name: 'Node.js',
    description: 'Backend services & APIs',
    logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg',
    url: 'https://nodejs.org',
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-first CSS styling',
    logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-plain.svg',
    url: 'https://tailwindcss.com',
  },
  {
    name: 'Firebase',
    description: 'Realtime database & auth',
    logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/firebase/firebase-plain.svg',
    url: 'https://firebase.google.com',
  },
];

const socialIcons = [
  { Icon: Github, name: "GitHub", url: "https://github.com/your-username" },
  { Icon: Linkedin, name: "LinkedIn", url: "https://linkedin.com/in/your-profile" },
  { Icon: Twitter, name: "Twitter", url: "https://twitter.com/your-handle" },
  { Icon: Mail, name: "Email", url: "mailto:your-email@example.com" }
];

function useTypingEffect(textToType: string, speed = 100) {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);
  const isMounted = useRef(true);

  useEffect(() => {
    // Validate input
    if (!textToType || typeof textToType !== 'string') {
      console.warn('useTypingEffect: Invalid textToType provided', textToType);
      return;
    }

    // Reset state
    indexRef.current = 0;
    setDisplayedText('');
    isMounted.current = true;

    // Use requestAnimationFrame for smoother updates
    let lastTimestamp: number | null = null;

    const typeCharacter = (timestamp: number) => {
      if (!isMounted.current) return;

      // Initialize lastTimestamp on first call
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }

      // Only update if enough time has passed
      if (timestamp - lastTimestamp >= speed) {
        setDisplayedText(textToType.slice(0, indexRef.current + 1));
        console.log(`Typing index ${indexRef.current}: ${textToType[indexRef.current]} -> ${textToType.slice(0, indexRef.current + 1)}`);
        indexRef.current += 1;
        lastTimestamp = timestamp;
      }

      // Continue animation if not complete
      if (indexRef.current < textToType.length) {
        requestAnimationFrame(typeCharacter);
      } else {
        console.log('Typing complete:', textToType);
      }
    };

    // Start the animation
    const animationId = requestAnimationFrame(typeCharacter);

    // Cleanup
    return () => {
      isMounted.current = false;
      cancelAnimationFrame(animationId);
      console.log('Cleaning up useTypingEffect animation');
    };
  }, [textToType, speed]);

  return displayedText;
}
function SkillBadge({ skill }: { skill: Skill }) {
  return (
    <a
      href={skill.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-all duration-300 border bg-slate-100 hover:bg-violet-100 border-gray-200 hover:border-violet-300 text-gray-800 dark:bg-gray-800 dark:hover:bg-violet-900 dark:border-gray-700 dark:hover:border-violet-600 dark:text-gray-200"
      title={skill.description}
    >
      <img src={skill.logo} alt={`${skill.name} logo`} className="w-4 h-4" />
      {skill.name}
    </a>
  );
}

function AboutPageContent() {
  const typedName = useTypingEffect("Kooru Mahey", 150);
  const cardRef = useRef<HTMLDivElement>(null); // Fix: Type as HTMLDivElement
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clampedX = Math.max(-100, Math.min(100, e.clientX - centerX));
    const clampedY = Math.max(-100, Math.min(100, e.clientY - centerY));
    x.set(clampedX);
    y.set(clampedY);
  };

  const handleMouseLeave = () => {
    animate(x, 0, { type: 'spring', stiffness: 150, damping: 20 });
    animate(y, 0, { type: 'spring', stiffness: 150, damping: 20 });
  };

  return (
    <div className="flex items-center justify-center w-full h-full px-4 overflow-hidden transition-all duration-500 bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full"
        >
          <div className="w-full rounded-2xl shadow-xl border overflow-hidden transition-all duration-500 bg-white dark:bg-gray-850 border-gray-200 dark:border-gray-700">
            {/* Banner */}
            <div className="relative h-32 sm:h-48 w-full bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500">
              <div className="absolute inset-0 bg-black/20 dark:bg-black/40 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Avatar + Name with tilt */}
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="flex flex-col items-center p-6 -mt-16 sm:-mt-24 sm:flex-row sm:items-end sm:space-x-6"
              style={{ perspective: 1000 }}
              animate={{ rotateX, rotateY }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            >
              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="shadow-lg rounded-full bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700"
              >
                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-violet-400/90 to-pink-400/90 flex items-center justify-center text-white text-2xl sm:text-4xl font-bold border-4 border-white dark:border-gray-800 shadow-xl">
                  KM
                </div>
              </motion.div>

              {/* Name + Title */}
              <div className="mt-4 text-center sm:mt-0 sm:text-left">
                <h1 className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-violet-600 to-orange-500 bg-clip-text text-transparent">
                  {typedName}
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                    className="inline-block bg-violet-600 dark:bg-violet-400 rounded-sm w-1 h-6 sm:h-8 align-middle ml-1"
                  />
                </h1>
                <p className="mt-1 text-sm sm:text-lg text-gray-600 dark:text-gray-700 transition-colors duration-300">
                  Full-Stack Developer & AI Enthusiast
                </p>
              </div>
            </motion.div>

            {/* Content */}
            <div className="space-y-6 px-6 pb-8">
              {/* About */}
              <div className="space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-800 transition-colors duration-300">
                <p>
                  Hello! I'm{' '}
                  <strong className="text-gray-800 dark:text-gray-800">Kooru Mahey</strong>, a passionate
                  developer with a love for creating beautiful, functional, and user-centric web
                  applications. My journey into AI has been incredibly exciting, and I'm always
                  exploring new ways to integrate intelligence into my projects.
                </p>
                <p>
                  This Lab Status Central project is a demonstration of my skills in{' '}
                  <strong className="text-gray-800 dark:text-gray-800">
                    full-stack development with Next.js
                  </strong>
                  ,{' '}
                  <strong className="text-gray-800 dark:text-gray-800">state management with React</strong>
                  , and{' '}
                  <strong className="text-gray-800 dark:text-gray-800">
                    generative AI integration using Genkit
                  </strong>
                  .
                </p>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-violet-600 dark:text-violet-400 transition-colors duration-300">
                  My Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <SkillBadge key={skill.name} skill={skill} />
                  ))}
                </div>
              </div>

              {/* Socials */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-violet-600 dark:text-violet-400 transition-colors duration-300">
                  Connect With Me
                </h3>
                <div className="flex space-x-3">
                  {socialIcons.map(({ Icon, name, url }) => (
                    <motion.a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 sm:p-3 rounded-full border transition-all duration-300 bg-gray-100 hover:bg-violet-100 border-gray-200 hover:border-violet-300 dark:bg-gray-700 dark:hover:bg-violet-800 dark:border-gray-600 dark:hover:border-violet-500"
                      title={name}
                    >
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 hover:text-violet-600 dark:text-gray-300 dark:hover:text-violet-400 transition-colors duration-300" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Framer Motion Variants
const nameContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const primaryLetterVariants = {
  hidden: { x: -40, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 12, stiffness: 100 } },
};

const revealingLetterVariants = {
  hidden: { y: 25, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 12, stiffness: 100 } },
};

export default function AboutPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const revealTimer = setTimeout(() => setIsRevealed(true), 1200);
    const transitionTimer = setTimeout(() => setShowIntro(false), 5500);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(transitionTimer);
    };
  }, []);

  const kooruLetters = 'ooru'.split('');
  const maheyLetters = 'ahey'.split('');

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-background">
      {/* Background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center,
          hsl(var(--color-primary) / 0.15) 0%,
          hsl(var(--color-background)) 70%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
      />

      <AnimatePresence mode="wait">
        {showIntro ? (
          // Intro animation (centered)
          <motion.div
            key="intro"
            className="flex items-center justify-center h-full w-full"
            exit={{
              opacity: 0,
              filter: 'blur(10px)',
              scale: 0.9,
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
            }}
          >
            <motion.div
              className="inline-flex items-baseline font-extrabold text-4xl sm:text-7xl lg:text-9xl text-red-600 dark:text-red-600"
              style={{
                fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
                letterSpacing: '0.02em',
                lineHeight: 1.1,
                filter: 'drop-shadow(0 0 15px rgba(220, 38, 38, 0.8)) dark:drop-shadow(0 0 15px rgba(220, 38, 38, 0.8))',
              }}
              variants={nameContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.span variants={primaryLetterVariants}>K</motion.span>
              <motion.div
                className="inline-flex overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: isRevealed ? 'auto' : 0 }}
                transition={{ duration: 1.2, delay: 0.2 }}
              >
                {kooruLetters.map((letter, i) => (
                  <motion.span key={`kooru-${i}`} variants={revealingLetterVariants} className="inline-block">
                    {letter}
                  </motion.span>
                ))}
              </motion.div>
              <motion.span variants={primaryLetterVariants}>&nbsp;M</motion.span>
              <motion.div
                className="inline-flex overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: isRevealed ? 'auto' : 0 }}
                transition={{ duration: 1.2, delay: 0.4 }}
              >
                {maheyLetters.map((letter, i) => (
                  <motion.span key={`mahey-${i}`} variants={revealingLetterVariants} className="inline-block">
                    {letter}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          // About page content
          <motion.div
            key="about"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, duration: 1.2 }}
            className="flex items-center justify-center h-full w-full"
          >
            <AboutPageContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}