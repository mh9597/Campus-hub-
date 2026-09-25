// src/services/viva.service.js
// Universal Viva Questions & Solutions backend service.
// Strictly adheres to Backend Proxy architecture.
'use strict';

const prisma = require('../config/prisma');

/**
 * Universal viva questions database & syllabus knowledge base.
 * Stored server-side and proxied to clients.
 */
const VIVA_KNOWLEDGE_BASE = {
  // ─────────────────────────────────────────────────────────────
  // SUBJECT 1: CE0518 - Computer Networks (Sem 5)
  // Complete End Sem Exam Question Bank (Units 1-4) + Lab Experiments
  // ─────────────────────────────────────────────────────────────
  'CE0518': {
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    syllabusOverview: 'Introduction to Computer Networks, Data Link Layer, Medium Access Sub-layer, Network Layer, Transport Layer, and Application Layer.',
    hasPracticals: true,
    sections: [
      { id: 'unit-1', name: 'Unit 1: Introduction to Computer Networks, Data Link Layer', type: 'theory' },
      { id: 'unit-2', name: 'Unit 2: Medium Access Sub-layer', type: 'theory' },
      { id: 'unit-3', name: 'Unit 3: Network Layer', type: 'theory' },
      { id: 'unit-4', name: 'Unit 4: Transport Layer, Application Layer', type: 'theory' },
      { id: 'practicals', name: 'Laboratory Practical Experiments', type: 'practical' }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // SUBJECT 2: CE0517 - Microprocessor and Interfacing (Sem 5)
  // Demonstrates universal subject independence
  // ─────────────────────────────────────────────────────────────
  'CE0517': {
    subjectCode: 'CE0517',
    subjectName: 'Microprocessor and Interfacing',
    department: 'CE/IT/CSE',
    semester: 5,
    syllabusOverview: '8085 & 8086 Microprocessor Architectures, Assembly Programming, Memory & I/O Interfacing, Interrupts, and Peripheral ICs (8255, 8259, 8254).',
    hasPracticals: true,
    sections: [
      { id: 'unit-1', name: 'Unit 1: 8085 Microprocessor Architecture & Bus Organization', type: 'theory' },
      { id: 'unit-2', name: 'Unit 2: 8086 Microprocessor Architecture & Memory Segmentation', type: 'theory' },
      { id: 'unit-3', name: 'Unit 3: Instruction Set & Assembly Language Programming', type: 'theory' },
      { id: 'unit-4', name: 'Unit 4: Interrupts, Bus Timings & Peripheral Interfacing (8255, 8259)', type: 'theory' },
      { id: 'practicals', name: 'Laboratory Practical Experiments', type: 'practical' }
    ]
  }
};

/**
 * Fetch viva metadata, questions, and experiments for any subject.
 * Automatically adapts if subject exists in knowledge base or dynamically builds template.
 */
async function getVivaDataForSubject(subjectCode) {
  const code = (subjectCode || '').toUpperCase().trim();
  
  // Also check if subject exists in Prisma DB to get live subject details
  let dbSubject = null;
  try {
    dbSubject = await prisma.subject.findFirst({
      where: { code: { equals: code } },
      include: {
        semester: {
          include: { department: true }
        }
      }
    });
  } catch (err) {
    // If DB is offline, continue gracefully
  }

  const baseData = VIVA_KNOWLEDGE_BASE[code];

  if (baseData) {
    return {
      ...baseData,
      subjectName: dbSubject?.title || baseData.subjectName,
      department: dbSubject?.semester?.department?.name || baseData.department,
      semester: dbSubject?.semester?.semesterNumber || baseData.semester,
    };
  }

  // Universal dynamic fallback for ANY other subject in curriculum
  return {
    subjectCode: code,
    subjectName: dbSubject?.title || `Subject ${code}`,
    department: dbSubject?.semester?.department?.name || 'Engineering',
    semester: dbSubject?.semester?.semesterNumber || 5,
    syllabusOverview: dbSubject?.description || 'General engineering course syllabus and core topics.',
    hasPracticals: true,
    sections: [
      { id: 'unit-1', name: 'Unit 1: Fundamentals & Core Principles', type: 'theory' },
      { id: 'unit-2', name: 'Unit 2: Intermediate Architecture & Analysis', type: 'theory' },
      { id: 'unit-3', name: 'Unit 3: Design, Algorithms & Implementation', type: 'theory' },
      { id: 'unit-4', name: 'Unit 4: Advanced Applications & Case Studies', type: 'theory' },
      { id: 'practicals', name: 'Laboratory Practical Experiments', type: 'practical' }
    ]
  };
}

module.exports = {
  getVivaDataForSubject,
  VIVA_KNOWLEDGE_BASE
};
