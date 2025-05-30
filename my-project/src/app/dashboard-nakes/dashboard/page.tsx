// src/app/(dashboard_nakes)/dashboard/page.tsx
import { BookOpen, Edit3, MessageSquareHeart, TrendingUp, UserCircle, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
// src/app/(dashboard_nakes)/dashboard/page.tsx
import { BookOpen, Edit3, MessageSquareHeart, TrendingUp, UserCircle, CheckCircle, AlertCircle, Bell } from 'lucide-react'; // Tambahkan Bell di sini
import Link from 'next/link';
// Dummy data - Ganti dengan data dari Supabase nantinya
const nakesProfile = {
  name: "Suster Ani Wijaya",
  skorBurnout: 6.5, // Dari 10
  statusBurnout: "Sedang",
  logHariIni: "Belum Diisi", // "Sudah Diisi" atau "Belum Diisi"
  pelatihanBerikutnya: { title: "Teknik Relaksasi Dasar", due: "3 hari lagi" }
};

const quickActions = [
  { title: "Input Log Harian & Self-Assessment", href: "/log-harian", icon: <Edit3 className="w-7 h-7 text-white" />, color: "bg-blue-500 hover:bg-blue-600" },
  { title: "Mulai Modul Pelatihan", href: "/pelatihan", icon: <BookOpen className="w-7 h-7 text-white" />, color: "bg-green-500 hover:bg-green-600" },
  { title: "Konsultasi AI Assistant", href: "/ai-assistant", icon: <MessageSquareHeart className="w-7 h-7 text-white" />, color: "bg-purple-500 hover:bg-purple-600" },
];

const trainingProgress = [
    {id: 1, title: "Manajemen Stres Dasar", progress: 100, status: "Selesai"},
    {id: 2, title: "SOP Kegawatdaruratan", progress: 60, status: "Berjalan"},
    {id: 3, title: "Komunikasi Efektif", progress: 0, status: "Belum Dimulai"},
];

export default async function NakesDashboardPage() {
  // Fetch data Nakes dari Supabase
  const getStatusColor = (status: string) => {
    if (status === "Tinggi" || status === "Sangat Tinggi") return "text-red-600";
    if (status === "Sedang") return "text-yellow-600";
    return "text-green-600";
  };

  const getLogStatusClass = (status: string) => {
    return status === "Sudah Diisi" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Selamat Datang Kembali, {nakesProfile.name}!</h1>
        <p className="text-gray-600">Portal Anda untuk produktivitas dan kesejahteraan.</p>
      </div>

      {/* Ringkasan Kondisi Nakes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center hover:shadow-xl transition-shadow">
          <TrendingUp className={`w-10 h-10 mb-2 ${getStatusColor(nakesProfile.statusBurnout)}`} />
          <p className="text-sm font-medium text-gray-500">Skor Risiko Burnout Anda</p>
          <p className={`text-2xl font-bold ${getStatusColor(nakesProfile.statusBurnout)}`}>{nakesProfile.skorBurnout}/10 ({nakesProfile.statusBurnout})</p>
          <Link href="/histori-burnout" legacyBehavior>
            <a className="text-xs text-blue-500 hover:underline mt-2">Lihat Histori</a>
          </Link>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center hover:shadow-xl transition-shadow">
            {nakesProfile.logHariIni === "Sudah Diisi" ? 
                <CheckCircle className="w-10 h-10 mb-2 text-green-500" /> : 
                <AlertCircle className="w-10 h-10 mb-2 text-red-500" />
            }
          <p className="text-sm font-medium text-gray-500">Status Log Hari Ini</p>
          <p className={`text-2xl font-bold ${nakesProfile.logHariIni === "Sudah Diisi" ? 'text-green-600' : 'text-red-600'}`}>{nakesProfile.logHariIni}</p>
          {nakesProfile.logHariIni !== "Sudah Diisi" && (
             <Link href="/log-harian" legacyBehavior>
                <a className="text-xs text-blue-500 hover:underline mt-2">Isi Sekarang</a>
            </Link>
          )}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center hover:shadow-xl transition-shadow">
          <BookOpen className="w-10 h-10 mb-2 text-indigo-500" />
          <p className="text-sm font-medium text-gray-500">Pelatihan Berikutnya</p>
          <p className="text-lg font-semibold text-gray-800">{nakesProfile.pelatihanBerikutnya.title}</p>
          <p className="text-xs text-gray-500 mt-1">Jatuh tempo: {nakesProfile.pelatihanBerikutnya.due}</p>
        </div>
      </div>

      {/* Aksi Cepat */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Akses Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href} legacyBehavior>
              <a className={`${action.color} text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col items-center justify-center text-center`}>
                <div className="mb-3">{action.icon}</div>
                <span className="font-medium text-base">{action.title}</span>
              </a>
            </Link>
          ))}
        </div>
      </div>

      {/* Progres Pelatihan */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Progres Pelatihan Anda</h2>
        <div className="space-y-4">
            {trainingProgress.map(item => (
                <div key={item.id}>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{item.title}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.status === "Selesai" ? "bg-green-100 text-green-700" : item.status === "Berjalan" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>{item.status}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className={`h-2.5 rounded-full ${item.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                            style={{ width: `${item.progress}%` }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
      </div>
      
      {/* Notifikasi/Pengumuman dari Admin */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-blue-500" /> Pengumuman & Notifikasi
        </h2>
        <div className="p-3 rounded-md bg-blue-50 border-l-4 border-blue-400">
            <p className="text-sm font-medium text-blue-700">Jadwal baru untuk piket UGD minggu depan telah dirilis. Mohon periksa.</p>
            <p className="text-xs text-gray-500 mt-1">2 jam lalu - Dari Admin Faskes</p>
        </div>
        {/* Tambahkan list notifikasi lain di sini */}
      </div>
    </div>
  );
}