import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Character-by-character animated text with staggered entrance & interactive hover physics.
 */
export function SplitText({
  text = '',
  className = '',
  charClassName = '',
  delay = 0,
  stagger = 0.025,
  interactive = true,
  as: Component = 'span',
}) {
  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const charVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -60,
      filter: 'blur(6px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 14,
        stiffness: 240,
      },
    },
  };

  return (
    <Component className={`inline-flex flex-wrap items-baseline justify-center gap-x-[0.25em] ${className}`}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="inline-flex flex-wrap items-baseline justify-center gap-x-[0.25em]"
      >
        {words.map((word, wordIndex) => (
          <span key={`word-${wordIndex}`} className="inline-flex whitespace-nowrap">
            {word.split('').map((char, charIndex) => (
              <motion.span
                key={`char-${wordIndex}-${charIndex}`}
                variants={charVariants}
                whileHover={
                  interactive
                    ? {
                        y: -5,
                        scale: 1.2,
                        color: '#f59e0b',
                        textShadow: '0 0 12px rgba(245, 158, 11, 0.6)',
                        transition: { duration: 0.15, type: 'spring', stiffness: 400 },
                      }
                    : undefined
                }
                className={`inline-block origin-bottom transform-gpu transition-colors select-none ${charClassName}`}
              >
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.span>
    </Component>
  );
}

/**
 * Cyber/AI Matrix Scramble Decryptor Effect
 * Cycles through random glyphs before resolving to the target string.
 */
export function DecipherText({
  text = '',
  className = '',
  trigger = 'mount', // 'mount' | 'hover' | 'always'
  speed = 30,
  maxIterations = 10,
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isDeciphering, setIsDeciphering] = useState(false);
  const chars = '01ABCDEFGHJKMNPQRSTWXYZアイウエオカキクケコサシスセソタチツテト#@*+!=%&_';
  const animFrame = useRef(null);

  const startDecipher = () => {
    if (isDeciphering) return;
    setIsDeciphering(true);
    let iteration = 0;
    const target = text;

    const interval = setInterval(() => {
      setDisplayText(() =>
        target
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration / (maxIterations / target.length)) {
              return target[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      iteration += 1;
      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(target);
        setIsDeciphering(false);
      }
    }, speed);
  };

  useEffect(() => {
    startDecipher();
    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span
      onMouseEnter={trigger === 'hover' ? startDecipher : undefined}
      className={`font-mono transition-colors ${className}`}
    >
      {displayText}
    </span>
  );
}
