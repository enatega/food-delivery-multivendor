import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';



const AnimatedText = () => {
  const t = useTranslations();
  const texts = [
  t('burgers'),
  t('gifts'),
  t('desserts'),
  t('pizza')
];

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.07
    }
  },
  exit: {
    transition: {
      staggerChildren: 0.07,
      staggerDirection: 1
    }
  }
};

const letterVariants = {
  initial: {
    y: 40,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    y: -70,
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: "easeIn"
    }
  }
};
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % texts.length);
        setVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(cycle);
  }, []);

  const currentText = texts[index];

  return (
    <div className='w-[280px] md:w-[580px] h-[5rem] flex justify-center items-center relative '>
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={currentText}
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute flex flex-wrap justify-center items-center"
          >
            {currentText.split("").map((char, i) => (
              <motion.span
                key={i}
                variants={letterVariants}
                className='text-[40px] md:text-[80px] font-extrabold text-white inline-block'
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedText;
