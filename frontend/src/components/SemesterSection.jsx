import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Laptop, 
  Code2, 
  Cpu, 
  Database, 
  Rocket, 
  ArrowRight 
} from 'lucide-react';

const semesters = [
  {
    id: '01',
    title: 'Semester 01',
    description: 'Basics of Engineering, Mathematics, and Physics for computer science foundation.',
    icon: GraduationCap,
    gradient: 'from-blue-50 to-blue-100/50',
    pinColor: 'fill-blue-500',
    rotate: '-rotate-3',
    offset: 'mt-0',
  },
  {
    id: '02',
    title: 'Semester 02',
    description: 'Advanced Mathematics, basic electrical engineering, and introduction to C programming.',
    icon: BookOpen,
    gradient: 'from-emerald-50 to-emerald-100/50',
    pinColor: 'fill-emerald-500',
    rotate: 'rotate-2',
    offset: 'lg:mt-8 md:mt-6',
  },
  {
    id: '03',
    title: 'Semester 03',
    description: 'Data Structures, Database Management Systems, and Object-Oriented Programming.',
    icon: Laptop,
    gradient: 'from-purple-50 to-purple-100/50',
    pinColor: 'fill-purple-500',
    rotate: '-rotate-2',
    offset: 'mt-0',
  },
  {
    id: '04',
    title: 'Semester 04',
    description: 'Operating Systems, Computer Organization, and Computer Networks fundamentals.',
    icon: Code2,
    gradient: 'from-orange-50 to-orange-100/50',
    pinColor: 'fill-orange-500',
    rotate: 'rotate-3',
    offset: 'lg:mt-8 md:mt-6',
  },
  {
    id: '05',
    title: 'Semester 05',
    description: 'Design and Analysis of Algorithms, Software Engineering, and Web Technologies.',
    icon: Cpu,
    gradient: 'from-pink-50 to-pink-100/50',
    pinColor: 'fill-pink-500',
    rotate: '-rotate-1',
    offset: 'mt-0',
  },
  {
    id: '06',
    title: 'Semester 06',
    description: 'Theory of Computation, Artificial Intelligence, and advanced Web Development.',
    icon: Database,
    gradient: 'from-cyan-50 to-cyan-100/50',
    pinColor: 'fill-cyan-500',
    rotate: 'rotate-2',
    offset: 'lg:mt-8 md:mt-6',
  },
  {
    id: '07',
    title: 'Semester 07',
    description: 'Cloud Computing, Machine Learning, Information Security, and major projects.',
    icon: Rocket,
    gradient: 'from-amber-50 to-amber-100/50',
    pinColor: 'fill-amber-500',
    rotate: '-rotate-3',
    offset: 'mt-0',
  },
];

export default function SemesterSection() {
  return (
    <section className="relative w-full py-24 overflow-hidden bg-white">
      {/* Background Notebook Paper Pattern */}
      <div className="absolute inset-0 z-0 opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dotPattern" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#cbd5e1" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#dotPattern)" />
        </svg>
      </div>

      {/* Soft Blobs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0 pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 z-0 pointer-events-none"></div>

      {/* Curved Dashed SVG Connector Behind Cards */}
      <div className="absolute inset-0 z-0 hidden lg:block opacity-20 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M 150,250 C 400,100 800,400 1050,250 C 1300,100 800,600 600,650" 
            stroke="#94a3b8" 
            strokeWidth="3" 
            strokeDasharray="12 12" 
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Headings */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
            Browse Resources by Semester
          </h2>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
            Select your semester to access PYQs, Notes, Books, Practicals, Lab Manuals, Assignments, Viva Questions and more.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 lg:gap-y-12 pb-10">
          {semesters.map((sem, index) => {
            const Icon = sem.icon;
            // 7th item should be centered in the 3rd row for lg screens
            const isLast = index === 6;

            return (
              <div 
                key={sem.id} 
                className={`
                  relative bg-gradient-to-br ${sem.gradient} rounded-[32px] p-8 
                  shadow-[0_20px_50px_rgba(0,0,0,0.07)] border border-white/60
                  transition-all duration-500 ease-out cursor-pointer group
                  hover:scale-105 hover:rotate-0 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)]
                  hover:-translate-y-2 hover:bg-white
                  ${sem.rotate} ${sem.offset}
                  ${isLast ? 'lg:col-start-2' : ''}
                `}
              >
                {/* Push Pin */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 transition-transform duration-500 group-hover:-translate-y-1">
                  <svg width="40" height="40" viewBox="0 0 24 24" className="filter drop-shadow-md">
                    <path 
                      className={sem.pinColor}
                      d="M16 11V5.5C16 4.67 15.33 4 14.5 4h-5C8.67 4 8 4.67 8 5.5V11l-2 3v2h5v4l1 1 1-1v-4h5v-2l-2-3z"
                    />
                    <path 
                      fill="rgba(255,255,255,0.4)" 
                      d="M14.5 4h-5C8.67 4 8 4.67 8 5.5v1h8v-1C16 4.67 15.33 4 14.5 4z"
                    />
                  </svg>
                </div>

                {/* Faded Large Number */}
                <div className="absolute right-4 top-4 select-none pointer-events-none">
                  <span className="text-7xl font-black text-slate-900 opacity-5">
                    {sem.id}
                  </span>
                </div>

                <div className="relative z-10 flex flex-col h-full mt-4">
                  
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-slate-700" strokeWidth={2.5} />
                  </div>

                  {/* Text Content */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                    {sem.title}
                  </h3>
                  
                  <p className="text-slate-600 font-medium leading-relaxed mb-8 flex-grow">
                    {sem.description}
                  </p>

                  {/* Arrow Button */}
                  <div className="mt-auto flex justify-end">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:bg-green-600">
                      <ArrowRight className="w-6 h-6 text-white" strokeWidth={3} />
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
