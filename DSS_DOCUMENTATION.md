# Sistem Pendukung Keputusan (DSS) - Dokumentasi

## Gambaran Umum

Sistem Pendukung Keputusan (Decision Support System - DSS) adalah fitur cerdas yang memberikan analisis nilai dan rekomendasi personalisasi kepada guru dan siswa. Sistem ini mengintegrasikan klasifikasi nilai otomatis dengan saran tindakan berbasis data.

## Arsitektur Sistem

### 1. **Modul Klasifikasi (`lib/dss/classifier.ts`)**

#### Klasifikasi Nilai
Sistem mengklasifikasikan nilai numerik menjadi 4 kategori:

| Klasifikasi | Range | Label | Warna | Kategori |
|------------|-------|-------|-------|----------|
| Sangat Baik | 85-100 | Sangat Baik | #10b981 (Hijau) | excellent |
| Baik | 75-84 | Baik | #3b82f6 (Biru) | good |
| Cukup | 65-74 | Cukup | #f59e0b (Kuning) | fair |
| Kurang | 0-64 | Kurang | #ef4444 (Merah) | poor |

#### Fungsi Utama

```typescript
classifyGrade(nilai: number): GradeClassification
// Mengklasifikasikan nilai numerik

generateRecommendations(nilai: number, studentName: string): {
  recommendations: string[]
  actions: Action[]
  priority: 'high' | 'medium' | 'low'
}
// Generate rekomendasi berdasarkan klasifikasi

analyzeStudent(studentName: string, grades: number[]): StudentRecommendation
// Analisis satu siswa dari array nilai

analyzeClass(students: Array<{id, name, grades}>): ClassAnalysis
// Analisis seluruh kelas untuk rekomendasi level kelas
```

### 2. **API Endpoints**

#### A. Guru DSS - Analisis Kelas
**Endpoint:** `GET /api/guru/dss/kelas?classId={classId}`

**Authorization:** Bearer token (Guru role required)

**Response:**
```json
{
  "success": true,
  "data": {
    "classData": {
      "id": "...",
      "namaKelas": "XII MIPA 4",
      "jurusan": "MIPA",
      "angkatan": "2022",
      "totalSiswa": 32
    },
    "classAnalysis": {
      "totalStudents": 32,
      "averageGrade": 79.5,
      "excellentCount": 8,
      "goodCount": 16,
      "fairCount": 6,
      "poorCount": 2,
      "excellentPercentage": 25,
      "goodPercentage": 50,
      "fairPercentage": 19,
      "poorPercentage": 6,
      "studentsNeedingAttention": [
        {
          "studentId": "...",
          "studentName": "Eka Putra",
          "averageGrade": 62.5,
          "classification": "Kurang",
          "color": "#ef4444",
          "priority": "high",
          "recommendations": [...],
          "actions": [...]
        }
      ],
      "classRecommendations": [
        "⚠️ Persentase siswa dengan nilai kurang cukup tinggi...",
        "📋 Rencanakan program remedial kelas yang komprehensif..."
      ]
    }
  }
}
```

**Kegunaan:**
- Guru mendapat overview kelas
- Identifikasi siswa yang perlu intervensi
- Terima rekomendasi untuk strategi pembelajaran kelas

---

#### B. Siswa DSS - Analisis Personal
**Endpoint:** `GET /api/siswa/dss`

**Authorization:** Bearer token (Siswa role required)

**Response:**
```json
{
  "success": true,
  "data": {
    "student": {
      "id": "...",
      "name": "Ahmad Rizki",
      "noInduk": "2022001"
    },
    "personalAnalysis": {
      "studentName": "Ahmad Rizki",
      "averageGrade": 82.5,
      "classification": "Baik",
      "color": "#3b82f6",
      "priority": "low",
      "recommendations": [
        "Ahmad Rizki menunjukkan prestasi akademik yang baik.",
        "Terus tingkatkan konsentrasi dan disiplin dalam belajar...",
        ...
      ],
      "actions": [
        {
          "id": "monitor-1",
          "title": "Pemantauan Rutin",
          "description": "Pantau perkembangan nilai secara konsisten",
          "type": "monitoring"
        },
        ...
      ]
    },
    "gradesBySubject": [
      {
        "id": "...",
        "name": "Matematika",
        "kode": "MATH",
        "averageGrade": 85,
        "totalGrades": 5,
        "grades": [82, 85, 88, 85, 85]
      }
    ],
    "distributionData": [
      {
        "name": "Sangat Baik",
        "value": 5,
        "percentage": 33,
        "color": "#10b981"
      },
      ...
    ]
  }
}
```

**Kegunaan:**
- Siswa melihat analisis personal mereka
- Terima rekomendasi untuk peningkatan nilai
- Pahami area yang perlu ditingkatkan

---

### 3. **Rekomendasi Berdasarkan Klasifikasi**

#### Sangat Baik (85-100)
- ✅ Status: Prestasi sangat baik
- 🎯 Rekomendasi: Pertahankan konsistensi, ikuti program akselerasi
- ⚡ Tindakan: Program pengayaan, tutor sebaya, persiapan kompetisi

#### Baik (75-84)
- ✅ Status: Prestasi baik
- 🎯 Rekomendasi: Tingkatkan untuk mencapai nilai lebih tinggi
- ⚡ Tindakan: Pemantauan rutin, konsultasi guru

#### Cukup (65-74)
- ⚠️ Status: Perlu ditingkatkan
- 🎯 Rekomendasi: Ikuti remedial, tingkatkan partisipasi
- ⚡ Tindakan: Program remedial, pemantauan intensif, bimbingan belajar

#### Kurang (<65)
- 🔴 Status: Memerlukan perhatian urgent
- 🎯 Rekomendasi: Remedial intensif, komunikasi dengan orang tua
- ⚡ Tindakan: Remedial khusus, konseling mendalam, melibatkan orang tua, cek kehadiran

---

## Integrasi Frontend

### A. Halaman Guru Analisa (`app/(dashboard)/guru/analisa/page.tsx`)

**Fitur:**
1. **Fetch Data Real-time** dari `/api/guru/dss/kelas?classId={classId}`
2. **Dashboard Kelas** dengan statistik aggregate
3. **Kartu Rekomendasi Sistem** menampilkan insights level kelas
4. **Grid Siswa yang Perlu Perhatian** dengan prioritas visual
5. **Tabel Detail** untuk melihat semua siswa

**Flow:**
```
Load Page → useParams untuk ambil classId
        ↓
        useEffect fetch /api/guru/dss/kelas
        ↓
        Render summary stats, DSS recommendations, student cards
```

### B. Halaman Siswa Analisa (`app/(dashboard)/siswa/analisa/page.tsx`)

**Fitur:**
1. **Fetch Data Personal** dari `/api/siswa/dss`
2. **Banner Rekomendasi Berwarna** dengan klasifikasi & tindakan
3. **Statistik Personal** (rata-rata, tertinggi, terendah, total)
4. **Chart Analisis** (nilai, bulan, per mata pelajaran)
5. **Distribusi Klasifikasi** pie chart

**Flow:**
```
Load Page → useEffect fetch /api/siswa/dss
        ↓
        Also fetch /api/siswa for chart data
        ↓
        Render DSS banner + charts + recommendations
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Database (MongoDB)                        │
│   - User (students/teachers)                               │
│   - Grade (nilai students)                                 │
│   - Class, Enrollment, Subject                             │
└────────────────┬────────────────────────────────────────────┘
                 │
         ┌───────┴────────┐
         │                │
    ┌────▼─────────┐ ┌───▼──────────┐
    │ API Routes   │ │ API Routes   │
    │ /guru/dss/   │ │ /siswa/dss/  │
    │ kelas        │ │              │
    └────┬─────────┘ └───┬──────────┘
         │                │
         │ Query DB       │ Query DB
         ↓                ↓
    ┌────────────────────────────────┐
    │  DSS Classifier                │
    │  - Classification              │
    │  - Recommendations             │
    │  - Analysis Functions          │
    └────┬───────────────────────┬───┘
         │                       │
         └───────────┬───────────┘
                     │ JSON Response
         ┌───────────┴────────────┐
         │                        │
    ┌────▼──────────────┐ ┌──────▼───────────┐
    │ Guru Analisa Page│ │ Siswa Analisa Page│
    │ - Class stats    │ │ - Personal stats  │
    │ - DSS Recs       │ │ - DSS Recs        │
    │ - Student cards  │ │ - Recommendations │
    └──────────────────┘ └───────────────────┘
```

---

## Contoh Penggunaan API

### Test dengan cURL

#### 1. Test Guru DSS API
```bash
# Dapatkan token guru terlebih dahulu
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"guru@school.com","password":"password"}' \
  | jq '.token')

# Call guru DSS API
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/api/guru/dss/kelas?classId=xyz123"
```

#### 2. Test Siswa DSS API
```bash
# Dapatkan token siswa
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"siswa@school.com","password":"password"}' \
  | jq '.token')

# Call siswa DSS API
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/api/siswa/dss"
```

---

## Customization

### Mengubah Range Klasifikasi Nilai

Edit di `lib/dss/classifier.ts`:

```typescript
export const GRADE_CLASSIFICATIONS: GradeClassification[] = [
  {
    range: [90, 100],  // ← Ubah range di sini
    label: 'A+',
    category: 'excellent',
    color: '#10b981',
  },
  // ...
]
```

### Mengubah Rekomendasi

Edit fungsi `generateRecommendations()` di `lib/dss/classifier.ts`:

```typescript
case 'excellent':
  return {
    recommendations: [
      'Rekomendasi baru di sini...',  // ← Ubah rekomendasi
      // ...
    ],
    actions: [
      // Ubah atau tambah action
    ],
    // ...
  }
```

---

## Troubleshooting

### Issue: API returns "Unauthorized"
- ✅ Pastikan JWT token valid
- ✅ Pastikan role adalah 'Guru' (untuk `/api/guru/dss`) atau 'Siswa' (untuk `/api/siswa/dss`)
- ✅ Token harus dikirim dengan header: `Authorization: Bearer {token}`

### Issue: Tidak ada data dalam response
- ✅ Pastikan siswa/guru sudah terdaftar di database
- ✅ Pastikan sudah ada nilai (Grade) di database untuk siswa
- ✅ Cek enrollment - siswa harus terdaftar di kelas

### Issue: Halaman loading terus
- ✅ Buka browser console (F12) dan check error
- ✅ Pastikan API endpoint accessible
- ✅ Pastikan token tersimpan di localStorage

---

## Performance Notes

- API queries menggunakan `.lean()` untuk read-only performance
- Aggregate dilakukan di aplikasi, bukan di database (untuk fleksibilitas)
- Classification dilakukan in-memory (sangat cepat)
- Rekomendasi generated on-demand, tidak disimpan ke database

---

## Future Enhancements

1. **Persistent DSS Rules** - Simpan configuration ke database
2. **Admin Interface** - UI untuk customize classifications & recommendations
3. **Notifications** - Email/push untuk parents saat ada nilai kurang
4. **Historical Tracking** - Simpan history rekomendasi per siswa
5. **AI-Powered** - Integrasi ML untuk predictive recommendations
6. **Export** - Generate PDF report dengan DSS analysis
