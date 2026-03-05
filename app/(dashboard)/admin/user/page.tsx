import { getUsers } from '@/lib/user/api'
import AdminUserClient from './AdminUserClient';

// interface User {
//   id: string
//   nama: string
//   email: string
//   noInduk: string
//   role: 'Siswa' | 'Guru' | 'Admin'
//   status: 'aktif' | 'nonaktif'
// }

// const usersList: User[] = [
//   { id: '1', nama: 'Ahmad Rizki Pratama', email: 'ahmad@student.com', noInduk: '123456', role: 'Siswa', status: 'aktif' },
//   { id: '2', nama: 'Siti Rahayu Nurdin', email: 'siti@student.com', noInduk: '123457', role: 'Siswa', status: 'aktif' },
//   { id: '3', nama: 'Ibu Siti Nurhaliza, S.Pd', email: 'siti@teacher.com', noInduk: '197503051998032001', role: 'Guru', status: 'aktif' },
//   { id: '4', nama: 'Pak Doni Hermawan, S.Pd', email: 'doni@teacher.com', noInduk: '197505021999021001', role: 'Guru', status: 'aktif' },
//   { id: '5', nama: 'Admin Sistem', email: 'Admin@school.com', noInduk: 'ADM001', role: 'Admin', status: 'aktif' },
//   { id: '6', nama: 'Muhammad Fajar Rizky', email: 'fajar@student.com', noInduk: '123458', role: 'Siswa', status: 'nonaktif' },
// ]

export default async function AdminUserPage() {
  const users = await getUsers();
  console.log(users, 'memek');

  return (
    <>
      <AdminUserClient usersList={users} ></AdminUserClient>
    </>
  );
}
