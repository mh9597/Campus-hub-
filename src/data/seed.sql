-- =============================================================================
-- Student Resource Hub — Seed Data
-- Run this AFTER schema.sql in your database SQL editor
-- This populates all 7 semesters and 43 subjects from the static data file.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- SEMESTERS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.semesters (id, name, description, bg_color, pin_color, rotate, resources_count) VALUES
(1, 'Semester 1', 'Access all foundational study resources for Semester 1 students.', '#E6F8F1', 'emerald', '-1deg', '120+ Resources'),
(2, 'Semester 2', 'Advance your core engineering concepts with these specialized assets.', '#E6F4FF', 'sky', '1.5deg', '95+ Resources'),
(3, 'Semester 3', 'Deep dive into data structures and algorithmic complexity materials.', '#FFFDE6', 'yellow', '-1.2deg', '150+ Resources'),
(4, 'Semester 4', 'Operating systems and database management system repositories.', '#F3E8FF', 'purple', '0.8deg', '110+ Resources'),
(5, 'Semester 5', 'Advanced networking and software engineering methodology guides.', '#FFF1E6', 'orange', '-1.5deg', '85+ Resources'),
(6, 'Semester 6', 'Artificial Intelligence and machine learning elective resources.', '#E0FCFF', 'cyan', '0.5deg', '140+ Resources'),
(7, 'Semester 7', 'Cyber security protocols and cloud computing architectural frameworks.', '#FFEBF5', 'rose', '1.2deg', '70+ Resources')
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- SEMESTER 1 SUBJECTS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.subjects (semester_id, code, title, description, bg_color, rotate, pin_color, icon, resources_count, card_type) VALUES
(1, 'MA0111', 'Calculus', 'Mastering limits, derivatives, and integral functions for engineering.', '#f0fdf4', '-1.5deg', 'green', 'book', '30+ Resources', 'pinned-card'),
(1, 'CH0011', 'Engineering Chemistry', 'Core chemical concepts applied to materials and systems.', '#f0f9ff', '1.2deg', 'blue', 'book', '30+ Resources', 'pinned-card'),
(1, 'EN0111', 'Technical Communication', 'Developing professional writing and presentation skills.', '#fffbeb', '-0.8deg', 'yellow', 'book', '30+ Resources', 'pinned-card'),
(1, 'ME0019', 'Engineering Graphics', 'Visual communication through technical drawing and CAD.', '#f5f3ff', '1.8deg', 'purple', 'book', '30+ Resources', 'pinned-card'),
(1, 'CV0004', 'Environmental Science', 'Understanding sustainability and ecological impact in engineering.', '#fff7ed', '-1.2deg', 'orange', 'book', '30+ Resources', 'pinned-card'),
(1, 'IKS01', 'Indian Knowledge System', 'Exploring traditional wisdom and its modern scientific relevance.', '#fdf2f8', '0.9deg', 'pink', 'code', '30+ Resources', 'pinned-card');

-- ─────────────────────────────────────────────────────────────────────────────
-- SEMESTER 2 SUBJECTS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.subjects (semester_id, code, title, description, bg_color, rotate, pin_color, icon, resources_count, card_type) VALUES
(2, 'MA0211', 'Differential Equations & Linear Algebra', 'Advanced mathematical methods for modeling physical systems.', 'rgb(240, 253, 244)', '-1.5deg', 'green', 'book', '30+ Resources', 'pinned-card'),
(2, 'PH0011', 'Engineering Physics', 'Fundamental principles of physics applied to engineering problems.', 'rgb(240, 249, 255)', '1.2deg', 'blue', 'book', '30+ Resources', 'pinned-card'),
(2, 'EN0211', 'Business Communication & Presentation Skills', 'Enhancing professional communication and public speaking abilities.', 'rgb(255, 251, 235)', '-0.8deg', 'yellow', 'book', '30+ Resources', 'pinned-card'),
(2, 'CE0216', 'Programming for Problem Solving', 'Introduction to algorithmic thinking and structured programming.', 'rgb(245, 243, 255)', '1.8deg', 'purple', 'book', '30+ Resources', 'pinned-card');

-- ─────────────────────────────────────────────────────────────────────────────
-- SEMESTER 3 SUBJECTS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.subjects (semester_id, code, title, description, bg_color, rotate, pin_color, icon, resources_count, card_type) VALUES
(3, 'MA0311', 'Probability, Statistics & Numerical Methods', 'Study probability, statistics, numerical methods and mathematical modeling.', '#f0fdf4', '', 'green', 'book', '30+ Resources', 'pinned-card'),
(3, 'CE0320', 'Computer Organization & Architecture', 'Learn processor architecture, memory hierarchy, and instruction sets.', '#f0f9ff', '', 'blue', 'book', '30+ Resources', 'pinned-card'),
(3, 'EC0319', 'Digital Electronics', 'Study Boolean algebra, logic gates, and sequential circuits.', '#fffbeb', '', 'yellow', 'book', '30+ Resources', 'pinned-card'),
(3, 'CE0316', 'Object Oriented Concepts with UML', 'Learn OOP concepts, UML diagrams and software design.', '#f5f3ff', '', 'purple', 'book', '30+ Resources', 'pinned-card'),
(3, 'CE0317', 'Database Management System', 'Study SQL, normalization, ER models, and database design.', '#fdf2f8', '', 'pink', 'book', '30+ Resources', 'pinned-card'),
(3, 'SS0301', 'Human Values and Professional Ethics', 'Understand professional ethics, leadership, and human values.', '#fff7ed', '', 'orange', 'book', '30+ Resources', 'pinned-card');

-- ─────────────────────────────────────────────────────────────────────────────
-- SEMESTER 4 SUBJECTS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.subjects (semester_id, code, title, description, bg_color, rotate, pin_color, icon, resources_count, card_type) VALUES
(4, 'CE0417', 'Data Structures & Algorithms', 'Master arrays, linked lists, stacks, queues, trees, graphs, sorting, searching, and algorithm design techniques.', 'rgb(240, 253, 244)', '-1.93deg', 'green', 'book', '30+ Resources', 'pinned-card'),
(4, 'CE0418', 'Operating System', 'Study process management, memory management, CPU scheduling, file systems, synchronization, and deadlocks.', 'rgb(240, 249, 255)', '1.38deg', 'blue', 'book', '30+ Resources', 'pinned-card'),
(4, 'BB0311', 'Management for Engineers', 'Learn engineering management, leadership, project planning, teamwork, communication, and organizational behavior.', 'rgb(255, 251, 235)', '-1.05deg', 'yellow', 'book', '30+ Resources', 'pinned-card'),
(4, 'CE0421', 'Core Java Programming', 'Learn Java fundamentals, OOP concepts, exception handling, collections, multithreading, and GUI basics.', 'rgb(245, 243, 255)', '0.37deg', 'purple', 'book', '30+ Resources', 'pinned-card'),
(4, 'EC0424', 'Introduction to IoT', 'Understand IoT architecture, smart devices, communication protocols, cloud integration, and real-world IoT applications.', 'rgb(253, 242, 248)', '-0.21deg', 'pink', 'book', '30+ Resources', 'pinned-card'),
(4, 'EC0425', 'IoT Sensors and Devices', 'Explore IoT sensors, actuators, embedded systems, microcontrollers, and sensor interfacing techniques.', 'rgb(255, 247, 237)', '-1.88deg', 'orange', 'book', '30+ Resources', 'pinned-card');

-- ─────────────────────────────────────────────────────────────────────────────
-- SEMESTER 5 SUBJECTS (premium-card type)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.subjects (semester_id, code, title, description, bg_color, rotate, pin_color, icon, resources_count, card_type, path) VALUES
(5, 'CE0516', 'Design and Analysis of Algorithms', 'Learn algorithm design techniques, asymptotic analysis, divide and conquer, greedy algorithms, dynamic programming, backtracking, and graph algorithms.', '', '', 'red', 'account_tree', '42+ Resources', 'premium-card', '/subject/daa'),
(5, 'CE0517', 'Microprocessor and Interfacing', 'Study microprocessor architecture, assembly language programming, interfacing techniques, memory organization, and peripheral devices.', '', '', 'red', 'memory', '35+ Resources', 'premium-card', NULL),
(5, 'CE0518', 'Computer Networks', 'Explore networking fundamentals, OSI & TCP/IP models, routing, switching, protocols, network security, and wireless communication.', '', '', 'blue', 'hub', '50+ Resources', 'premium-card', NULL),
(5, 'CE0525', 'Programming for Scientific Computing', 'Learn scientific programming, numerical computation, mathematical modeling, simulations, and data analysis techniques.', '', '', 'emerald', 'function', '28+ Resources', 'premium-card', NULL),
(5, 'CE0522', 'Web Technology', 'Study HTML, CSS, JavaScript, responsive web design, frontend development, backend basics, and web applications.', '', '', 'orange', 'html', '45+ Resources', 'premium-card', NULL),
(5, 'EC0528', 'IoT Networks and Protocols', 'Understand IoT communication protocols including MQTT, CoAP, HTTP, Zigbee, LoRaWAN, BLE, and cloud connectivity.', '', '', 'purple', 'sensors', '20+ Resources', 'premium-card', NULL);

-- ─────────────────────────────────────────────────────────────────────────────
-- SEMESTER 6 SUBJECTS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.subjects (semester_id, code, title, description, bg_color, rotate, pin_color, icon, resources_count, card_type) VALUES
(6, 'CE0636', 'Automata Theory & Compiler Design', 'Study finite automata, regular expressions, CFG, parsing techniques, and compiler construction.', 'rgb(240, 249, 255)', '', 'blue', 'book', '30+ Resources', 'pinned-card'),
(6, 'CE0630', 'Data Science', 'Explore data analysis, visualization, machine learning fundamentals, statistics, and analytics.', 'rgb(255, 251, 235)', '', 'yellow', 'book', '30+ Resources', 'pinned-card'),
(6, 'CE0616', 'Software Engineering with UML', 'Learn software development life cycle, UML diagrams, software design, testing, and project management.', 'rgb(240, 253, 244)', '', 'green', 'book', '30+ Resources', 'pinned-card'),
(6, 'CE0634', 'Cryptography & Network Security', 'Learn encryption, authentication, digital signatures, network attacks, and security protocols.', 'rgb(255, 247, 237)', '', 'orange', 'book', '30+ Resources', 'pinned-card'),
(6, 'CE0618', 'Advanced Java Technology', 'Explore advanced Java concepts including Servlet, JSP, JDBC, Hibernate, Spring Framework, and web application development.', 'rgb(245, 243, 255)', '', 'purple', 'book', '30+ Resources', 'pinned-card'),
(6, 'CE0628', 'Mobile App Development', 'Learn Android and iOS application development, UI design, APIs, and mobile deployment.', 'rgb(245, 243, 255)', '', 'purple', 'book', '30+ Resources', 'pinned-card'),
(6, 'CE0622', 'Internet of Things', 'Explore IoT architecture, sensors, cloud connectivity, embedded devices, and smart applications.', 'rgb(240, 253, 244)', '', 'green', 'book', '30+ Resources', 'pinned-card'),
(6, 'CE0633', 'Distributed Systems', 'Study distributed computing, synchronization, fault tolerance, and cloud architectures.', 'rgb(253, 242, 248)', '', 'pink', 'book', '30+ Resources', 'pinned-card'),
(6, 'EC0627', 'Security and Privacy in IoT', 'Explore security frameworks, privacy challenges, and mitigation strategies specifically for IoT ecosystems.', 'rgb(240, 249, 255)', '', 'blue', 'book', '30+ Resources', 'pinned-card'),
(6, 'EC0625', 'IoT Programming', 'Hands-on development for IoT devices, covering communication protocols, edge computing, and sensor integration.', 'rgb(255, 251, 235)', '', 'yellow', 'book', '30+ Resources', 'pinned-card');

-- ─────────────────────────────────────────────────────────────────────────────
-- SEMESTER 7 SUBJECTS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.subjects (semester_id, code, title, description, bg_color, rotate, pin_color, icon, resources_count, card_type) VALUES
(7, 'CE0716', 'Data Mining & Warehousing', 'Study ETL processes, data warehousing, association rules, and clustering.', '#fffbeb', '', 'yellow', 'book', '30+ Resources', 'pinned-card'),
(7, 'CE0733', 'Machine Learning & Deep Learning', 'Learn supervised and unsupervised learning, neural networks, and deep learning.', '#fff7ed', '', 'orange', 'book', '30+ Resources', 'pinned-card'),
(7, 'CE0729', 'Cyber Security', 'Explore network security, cryptography, ethical hacking, and digital forensics.', '#f0f9ff', '', 'blue', 'book', '30+ Resources', 'pinned-card'),
(7, 'CE0728', 'Natural Language Processing', 'Explore computational linguistics and language models for natural speech.', '#f5f3ff', '', 'purple', 'book', '30+ Resources', 'pinned-card'),
(7, 'CE0723', 'Cloud Computing', 'Learn about AWS, Azure, Google Cloud, virtualization, and serverless architecture.', '#f0fdf4', '', 'green', 'book', '30+ Resources', 'pinned-card');

-- ─────────────────────────────────────────────────────────────────────────────
-- OPPORTUNITIES (seed data)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.opportunities (title, description, emoji, tag, tag_type, rotate, pin_bg, category) VALUES
('Upcoming Hackathons', 'Collaborate with peers to build innovative solutions for real-world problems. Great for portfolio building.', '🚀', 'Active', 'primary', '-1deg', 'radial-gradient(circle at 30% 30%, #ef4444, #991b1b)', 'Hackathons'),
('Internships', 'Gain professional experience with top companies in tech, finance, and creative industries worldwide.', '💼', 'High Demand', 'tertiary', '1.2deg', 'radial-gradient(circle at 30% 30%, rgb(59, 130, 246), rgb(30, 58, 138))', 'Internships'),
('Scholarships', 'Financial aid opportunities for undergraduate and postgraduate studies across various disciplines.', '🎓', 'Funded', 'error', '0.5deg', 'radial-gradient(circle at 30% 30%, rgb(16, 185, 129), rgb(6, 78, 59))', 'Scholarships'),
('Workshops', 'Hands-on learning sessions led by industry experts to master specific tools and technologies.', '🛠', 'Certified', 'primary', '-1.5deg', 'radial-gradient(circle at 30% 30%, rgb(168, 85, 247), rgb(88, 28, 135))', 'Workshops'),
('Webinars', 'Live online seminars featuring thought leaders discussing current trends and career advice.', '🎥', 'Online', 'tertiary', '0.9deg', 'radial-gradient(circle at 30% 30%, rgb(6, 182, 212), rgb(22, 78, 99))', 'Online'),
('Certifications', 'Validate your skills with industry-recognized certificates from leading providers and universities.', '📜', 'Self-paced', 'primary', '-0.4deg', 'radial-gradient(circle at 30% 30%, #6366f1, #312e81)', 'Remote'),
('College Events', 'Stay updated with cultural fests, technical events, and campus activities happening near you.', '📅', 'Cultural', 'primary', '0.7deg', 'radial-gradient(circle at 30% 30%, #f59e0b, #b45309)', 'Coding');

-- ─────────────────────────────────────────────────────────────────────────────
-- ANNOUNCEMENTS (seed data)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.announcements (text, badge, color, deadline, created_at) VALUES
('Google Summer of Code registrations are open.', 'New', 'bg-green-500', NULL, NOW() - INTERVAL '2 hours'),
('Smart India Hackathon 2026 registrations started.', 'New', 'bg-red-500', NULL, NOW() - INTERVAL '5 hours'),
('Microsoft Internship applications closing soon.', 'Closing Soon', 'bg-yellow-500', 'Oct 25, 2026', NOW() - INTERVAL '1 day'),
('Amazon Campus Hiring announced for SDE roles.', 'Updated', 'bg-blue-500', 'Nov 10, 2026', NOW() - INTERVAL '2 days'),
('NPTEL July Certification enrollment open.', NULL, 'bg-purple-500', NULL, NOW() - INTERVAL '3 days');
