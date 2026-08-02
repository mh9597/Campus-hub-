import React from 'react';
import HeroSection from './components/HeroSection';
import CategoryMarquee from './components/CategoryMarquee';
import LearningPlatformsSection from './components/Free Courses Platforms Section';
import VideoSection from './components/VideoSection';
import FeatureStrip from './components/FeatureStrip';
import TestimonialsSection from './components/TestimonialsSection';
import BackgroundDecorations from './components/BackgroundDecorations';

function Home() {
  return (
    <div className="bg-[#FDFBF7] text-hub-navy font-poppins min-h-screen relative overflow-hidden selection:bg-amber-300 selection:text-hub-navy">
      {/* Background Decor SVG Vector Layers */}
      <BackgroundDecorations />

      {/* Main Page Sections */}
      <div className="relative z-10">
        <HeroSection />
        <CategoryMarquee />
        <LearningPlatformsSection />
        <VideoSection />
        <FeatureStrip />
        <TestimonialsSection />
      </div>
    </div>
  );
}

export default Home;
