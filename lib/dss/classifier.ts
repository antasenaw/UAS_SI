/**
 * Decision Support System (DSS) - Grade Classification and Recommendations
 */

export interface GradeClassification {
  range: [number, number];
  label: string;
  category: 'excellent' | 'good' | 'fair' | 'poor';
  color: string;
}

export interface StudentRecommendation {
  studentId: string;
  studentName: string;
  averageGrade: number;
  classification: string;
  color: string;
  recommendations: string[];
  priority: 'high' | 'medium' | 'low';
  actions: Action[];
}

export interface ClassAnalysis {
  totalStudents: number;
  averageGrade: number;
  excellentCount: number;
  goodCount: number;
  fairCount: number;
  poorCount: number;
  excellentPercentage: number;
  goodPercentage: number;
  fairPercentage: number;
  poorPercentage: number;
  studentsNeedingAttention: StudentRecommendation[];
  classRecommendations: string[];
}

export interface Action {
  id: string;
  title: string;
  description: string;
  type: 'remedial' | 'enrichment' | 'monitoring' | 'counseling';
}

// Grade Classification System
export const GRADE_CLASSIFICATIONS: GradeClassification[] = [
  {
    range: [85, 100],
    label: 'Sangat Baik',
    category: 'excellent',
    color: '#10b981',
  },
  {
    range: [75, 84],
    label: 'Baik',
    category: 'good',
    color: '#3b82f6',
  },
  {
    range: [65, 74],
    label: 'Cukup',
    category: 'fair',
    color: '#f59e0b',
  },
  {
    range: [0, 64],
    label: 'Kurang',
    category: 'poor',
    color: '#ef4444',
  },
];

/**
 * Classify grade value to category
 */
export function classifyGrade(nilai: number): GradeClassification {
  const classification = GRADE_CLASSIFICATIONS.find(
    (c) => nilai >= c.range[0] && nilai <= c.range[1]
  );
  return classification || GRADE_CLASSIFICATIONS[GRADE_CLASSIFICATIONS.length - 1];
}

/**
 * Generate recommendations based on grade classification
 */
export function generateRecommendations(
  nilai: number,
  studentName: string
): {
  recommendations: string[];
  actions: Action[];
  priority: 'high' | 'medium' | 'low';
} {
  const classification = classifyGrade(nilai);

  switch (classification.category) {
    case 'excellent':
      return {
        recommendations: [
          `${studentName} menunjukkan prestasi akademik yang sangat baik.`,
          'Pertahankan konsistensi dalam belajar dan kerjakan soal-soal tambahan.',
          'Pertimbangkan untuk mengikuti program akselerasi atau kompetisi akademik.',
          'Jadilah tutor sebaya untuk membantu teman-teman lainnya.',
        ],
        actions: [
          {
            id: 'enrich-1',
            title: 'Program Pengayaan',
            description: 'Ikuti kelas akselerasi untuk topik lanjutan',
            type: 'enrichment',
          },
          {
            id: 'peer-tutor',
            title: 'Tutor Sebaya',
            description: 'Menjadi tutor untuk membantu siswa lain',
            type: 'enrichment',
          },
          {
            id: 'competition',
            title: 'Persiapan Kompetisi',
            description: 'Persiapkan diri untuk kompetisi akademik',
            type: 'enrichment',
          },
        ],
        priority: 'low',
      };

    case 'good':
      return {
        recommendations: [
          `${studentName} menunjukkan prestasi akademik yang baik.`,
          'Terus tingkatkan konsentrasi dan disiplin dalam belajar.',
          'Pelajari kembali topik yang masih sulit dan diskusikan dengan guru.',
          'Rencanakan strategi belajar yang lebih efektif untuk mencapai nilai yang lebih tinggi.',
        ],
        actions: [
          {
            id: 'monitor-1',
            title: 'Pemantauan Rutin',
            description: 'Pantau perkembangan nilai secara konsisten',
            type: 'monitoring',
          },
          {
            id: 'consult-1',
            title: 'Konsultasi Guru',
            description: 'Diskusikan strategi peningkatan nilai',
            type: 'counseling',
          },
        ],
        priority: 'low',
      };

    case 'fair':
      return {
        recommendations: [
          `${studentName} memiliki nilai yang cukup namun masih perlu ditingkatkan.`,
          'Ikuti program remedial untuk memperkuat pemahaman materi dasar.',
          'Tingkatkan kehadiran dan partisipasi aktif dalam pembelajaran di kelas.',
          'Mintalah bantuan guru untuk membuat rencana peningkatan nilai.',
          'Kelompokkan diri dengan siswa yang berprestasi untuk belajar bersama.',
        ],
        actions: [
          {
            id: 'remedial-1',
            title: 'Program Remedial',
            description: 'Mengikuti program perbaikan pemahaman materi',
            type: 'remedial',
          },
          {
            id: 'monitor-2',
            title: 'Pemantauan Intensif',
            description: 'Pantau kemajuan belajar setiap minggu',
            type: 'monitoring',
          },
          {
            id: 'counseling-1',
            title: 'Bimbingan Belajar',
            description: 'Konseling untuk identifikasi hambatan belajar',
            type: 'counseling',
          },
        ],
        priority: 'medium',
      };

    case 'poor':
      return {
        recommendations: [
          `${studentName} memiliki nilai yang kurang dan memerlukan perhatian khusus.`,
          'SEGERA ikuti program remedial intensif untuk perbaikan pemahaman materi.',
          'Konsultasikan dengan guru mata pelajaran tentang kesulitan yang dihadapi.',
          'Tingkatkan kehadiran kelas dan berpartisipasi aktif dalam pembelajaran.',
          'Mintalah bantuan kepada orang tua/wali untuk mendukung proses belajar.',
          'Pertimbangkan untuk mengambil les tambahan atau bimbingan belajar.',
        ],
        actions: [
          {
            id: 'remedial-urgent',
            title: 'Program Remedial Intensif',
            description: 'Remedial khusus dengan frekuensi lebih tinggi',
            type: 'remedial',
          },
          {
            id: 'counseling-urgent',
            title: 'Konseling & Bimbingan Khusus',
            description: 'Identifikasi masalah dan hambatan belajar secara mendalam',
            type: 'counseling',
          },
          {
            id: 'parental-involve',
            title: 'Melibatkan Orang Tua',
            description: 'Komunikasi dengan orang tua untuk dukungan di rumah',
            type: 'counseling',
          },
          {
            id: 'attendance-check',
            title: 'Cek Kehadiran',
            description: 'Pastikan siswa hadir dan aktif dalam setiap pembelajaran',
            type: 'monitoring',
          },
        ],
        priority: 'high',
      };

    default:
      return {
        recommendations: ['Silakan konsultasikan dengan guru untuk bimbingan lebih lanjut.'],
        actions: [],
        priority: 'low',
      };
  }
}

/**
 * Analyze student grades and generate recommendation
 */
export function analyzeStudent(
  studentName: string,
  grades: number[]
): StudentRecommendation {
  const averageGrade = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;
  const classification = classifyGrade(averageGrade);
  const { recommendations, actions, priority } = generateRecommendations(
    averageGrade,
    studentName
  );

  return {
    studentId: '',
    studentName,
    averageGrade: Math.round(averageGrade * 10) / 10,
    classification: classification.label,
    color: classification.color,
    recommendations,
    priority,
    actions,
  };
}

/**
 * Analyze entire class and generate class-level recommendations
 */
export function analyzeClass(
  students: {
    id: string;
    name: string;
    grades: number[];
  }[]
): ClassAnalysis {
  const studentAnalyses = students.map((s) => ({
    ...analyzeStudent(s.name, s.grades),
    studentId: s.id,
  }));

  const allGrades = students.flatMap((s) => s.grades);
  const averageGrade =
    allGrades.length > 0 ? allGrades.reduce((a, b) => a + b, 0) / allGrades.length : 0;

  const excellentCount = studentAnalyses.filter((s) => s.averageGrade >= 85).length;
  const goodCount = studentAnalyses.filter(
    (s) => s.averageGrade >= 75 && s.averageGrade < 85
  ).length;
  const fairCount = studentAnalyses.filter(
    (s) => s.averageGrade >= 65 && s.averageGrade < 75
  ).length;
  const poorCount = studentAnalyses.filter((s) => s.averageGrade < 65).length;

  const totalStudents = studentAnalyses.length;
  const excellentPercentage = totalStudents > 0 ? Math.round((excellentCount / totalStudents) * 100) : 0;
  const goodPercentage = totalStudents > 0 ? Math.round((goodCount / totalStudents) * 100) : 0;
  const fairPercentage = totalStudents > 0 ? Math.round((fairCount / totalStudents) * 100) : 0;
  const poorPercentage = totalStudents > 0 ? Math.round((poorCount / totalStudents) * 100) : 0;

  // Generate class-level recommendations
  const classRecommendations: string[] = [];

  if (excellentPercentage >= 60) {
    classRecommendations.push(
      '🎉 Kelas menunjukkan performa akademik yang sangat baik. Pertahankan momentum ini!'
    );
  } else if (excellentPercentage >= 40) {
    classRecommendations.push('✅ Sebagian besar siswa menunjukkan prestasi yang baik.');
  }

  if (poorPercentage >= 30) {
    classRecommendations.push(
      '⚠️ Persentase siswa dengan nilai kurang cukup tinggi. Perlu intervensi lebih intensif.'
    );
    classRecommendations.push('📋 Rencanakan program remedial kelas yang komprehensif.');
  } else if (poorPercentage >= 15) {
    classRecommendations.push('⚡ Ada beberapa siswa yang memerlukan perhatian khusus.');
  }

  if (goodPercentage >= 40 && fairPercentage >= 20) {
    classRecommendations.push(
      '📚 Fokus pada peningkatan kuantitas dan kualitas pembelajaran untuk kelompok menengah.'
    );
  }

  if (fairPercentage + poorPercentage >= 50) {
    classRecommendations.push(
      '🎯 Terapkan strategi pembelajaran yang lebih interaktif dan menarik.'
    );
  }

  return {
    totalStudents,
    averageGrade: Math.round(averageGrade * 10) / 10,
    excellentCount,
    goodCount,
    fairCount,
    poorCount,
    excellentPercentage,
    goodPercentage,
    fairPercentage,
    poorPercentage,
    studentsNeedingAttention: studentAnalyses
      .filter((s) => s.priority === 'high' || s.priority === 'medium')
      .sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }),
    classRecommendations,
  };
}
