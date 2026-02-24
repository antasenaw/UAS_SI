export default function ProfileCard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-gray-300 rounded-full mb-4" />

        <h2 className="font-semibold text-lg">Yogi Nugraha</h2>
        <p className="text-sm text-gray-500">XII RPL 1</p>

        <div className="mt-4 w-full text-sm">
          <p><strong>NISN:</strong> 12345678</p>
          <p><strong>Email:</strong> yogi@email.com</p>
        </div>
      </div>
    </div>
  )
}