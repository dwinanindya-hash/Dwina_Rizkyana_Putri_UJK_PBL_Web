
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

interface Siswa {
  id: number
  uid: string
  kode_siswa: string
  nama_siswa: string
  jurusan: string
  tanggal_lahir: string
  alamat: string
}

interface FormDataSiswa {
  kode_siswa: string
  nama_siswa: string
  jurusan: string
  tanggal_lahir: string
  alamat: string
}

const FORM_KOSONG: FormDataSiswa = {
  kode_siswa: '',
  nama_siswa: '',
  jurusan: '',
  tanggal_lahir: '',
  alamat: ''
}

const API_URL = 'http://localhost:5000/api/siswa'

function App() {
  const [siswa, setSiswa] = useState<Siswa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [keyword, setKeyword] = useState('')
  const [menuAktif, setMenuAktif] = useState('dashboard')

  // State formulir tambah dan edit
  const [formTerbuka, setFormTerbuka] = useState(false)
  const [modeEdit, setModeEdit] = useState(false)
  const [idEdit, setIdEdit] = useState<number | null>(null)
  const [formData, setFormData] = useState<FormDataSiswa>(FORM_KOSONG)

  // State proses dan notifikasi
  const [menyimpan, setMenyimpan] = useState(false)
  const [pesan, setPesan] = useState('')
  const [jenisPesan, setJenisPesan] = useState<'sukses' | 'error'>('sukses')

  // Mengambil seluruh data siswa dari backend
  const ambilDataSiswa = async () => {
    try {
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error('Gagal mengambil data siswa.')
      }

      const result = await response.json()
      setSiswa(result.data)
      setError('')
    } catch {
      setError('Tidak dapat mengambil data siswa. Periksa backend.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    ambilDataSiswa()
  }, [])

  // Menghitung jumlah siswa
  const totalIPA = siswa.filter(
    (item) => item.jurusan.toUpperCase() === 'IPA'
  ).length

  const totalIPS = siswa.filter(
    (item) => item.jurusan.toUpperCase() === 'IPS'
  ).length

  // Fitur pencarian
  const siswaTersaring = siswa.filter((item) => {
    const pencarian = keyword.toLowerCase()

    return (
      item.nama_siswa.toLowerCase().includes(pencarian) ||
      item.kode_siswa.toLowerCase().includes(pencarian) ||
      item.jurusan.toLowerCase().includes(pencarian)
    )
  })

  // Membuka formulir tambah
  const bukaFormTambah = () => {
    setModeEdit(false)
    setIdEdit(null)
    setFormData(FORM_KOSONG)
    setFormTerbuka(true)
    setPesan('')
  }

  // Membuka formulir edit
  const bukaFormEdit = (item: Siswa) => {
    setModeEdit(true)
    setIdEdit(item.id)

    setFormData({
      kode_siswa: item.kode_siswa,
      nama_siswa: item.nama_siswa,
      jurusan: item.jurusan,
      tanggal_lahir: item.tanggal_lahir.slice(0, 10),
      alamat: item.alamat
    })

    setFormTerbuka(true)
    setPesan('')
  }

  // Menutup formulir
  const tutupForm = () => {
    if (menyimpan) return

    setFormTerbuka(false)
    setFormData(FORM_KOSONG)
    setIdEdit(null)
  }

  // Menambah atau mengedit data siswa
  const simpanSiswa = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setMenyimpan(true)
    setPesan('')

    try {
      const url = modeEdit
        ? `${API_URL}/${idEdit}`
        : API_URL

      const response = await fetch(url, {
        method: modeEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.message || 'Gagal menyimpan data siswa.'
        )
      }

      await ambilDataSiswa()

      setFormTerbuka(false)
      setFormData(FORM_KOSONG)
      setIdEdit(null)

      setJenisPesan('sukses')
      setPesan(
        modeEdit
          ? 'Data siswa berhasil diperbarui!'
          : 'Data siswa berhasil ditambahkan!'
      )
    } catch (err) {
      setJenisPesan('error')
      setPesan(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat menyimpan data.'
      )
    } finally {
      setMenyimpan(false)
    }
  }

  // Menghapus data siswa
  const hapusSiswa = async (item: Siswa) => {
    const yakin = window.confirm(
      `Apakah kamu yakin ingin menghapus data ${item.nama_siswa}?`
    )

    if (!yakin) return

    setPesan('')

    try {
      const response = await fetch(`${API_URL}/${item.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.message || 'Gagal menghapus data siswa.'
        )
      }

      await ambilDataSiswa()

      setJenisPesan('sukses')
      setPesan('Data siswa berhasil dihapus!')
    } catch (err) {
      setJenisPesan('error')
      setPesan(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat menghapus data.'
      )
    }
  }

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>🎓 DataSiswa</h2>

        <p className="sidebar-label">MENU UTAMA</p>

        <div
          className={menuAktif === 'dashboard' ? 'menu-active' : 'menu-item'}
          onClick={() => {
            setMenuAktif('dashboard')
            setPesan('')
          }}
        >
          📊 Dashboard
        </div>

        <div
          className={menuAktif === 'siswa' ? 'menu-active' : 'menu-item'}
          onClick={() => {
            setMenuAktif('siswa')
            setPesan('')
          }}
        >
          👨‍🎓 Data Siswa
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="main-content">

        {/* HALAMAN DASHBOARD */}
        {menuAktif === 'dashboard' && (
          <>
            <header className="topbar">
              <div>
                <h1>Dashboard</h1>
                <p>Sistem Informasi Pendataan Siswa Sekolah</p>
              </div>
            </header>

            <section className="welcome">
              <h2>Selamat Datang!</h2>
              <p>
                Kelola data siswa sekolah dengan mudah dan teratur.
              </p>
            </section>

            <section className="summary-container">

              <div className="summary-card">
                <div>
                  <p>Total Siswa</p>
                  <h2>{loading ? '...' : siswa.length}</h2>
                </div>
                <span>👨‍🎓</span>
              </div>

              <div className="summary-card">
                <div>
                  <p>Siswa Jurusan IPA</p>
                  <h2>{loading ? '...' : totalIPA}</h2>
                </div>
                <span>🔬</span>
              </div>

              <div className="summary-card">
                <div>
                  <p>Siswa Jurusan IPS</p>
                  <h2>{loading ? '...' : totalIPS}</h2>
                </div>
                <span>📚</span>
              </div>

            </section>

            <section className="table-section">
              <h2>Informasi Data Siswa</h2>

              <p>
                Saat ini terdapat {siswa.length} data siswa
                yang tersimpan dalam sistem.
              </p>

              <button
                className="primary-button"
                onClick={() => setMenuAktif('siswa')}
              >
                Lihat Data Siswa
              </button>
            </section>
          </>
        )}

        {/* HALAMAN DATA SISWA */}
        {menuAktif === 'siswa' && (
          <>
            <header className="topbar">
              <div>
                <h1>Data Siswa</h1>
                <p>Kelola seluruh informasi siswa sekolah.</p>
              </div>
            </header>

            <section className="table-section">

              <div className="table-header">
                <h2>Daftar Seluruh Siswa</h2>

                <div className="table-actions">
                  <input
                    type="text"
                    placeholder="Cari nama, kode, atau jurusan..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="search-input"
                  />

                  <button
                    className="primary-button"
                    onClick={bukaFormTambah}
                  >
                    + Tambah Siswa
                  </button>
                </div>
              </div>

              {/* NOTIFIKASI */}
              {pesan && (
                <div className={`status-message ${jenisPesan}`}>
                  {pesan}
                  <button
                    type="button"
                    onClick={() => setPesan('')}
                  >
                    ×
                  </button>
                </div>
              )}

              {/* FORM TAMBAH DAN EDIT */}
              {formTerbuka && (
                <div className="form-section">
                  <h2>
                    {modeEdit ? 'Edit Data Siswa' : 'Tambah Data Siswa'}
                  </h2>

                  <form onSubmit={simpanSiswa}>

                    <label htmlFor="kode_siswa">Kode Siswa</label>
                    <input
                      id="kode_siswa"
                      type="text"
                      required
                      value={formData.kode_siswa}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          kode_siswa: e.target.value
                        })
                      }
                      placeholder="Contoh: S011"
                    />

                    <label htmlFor="nama_siswa">Nama Siswa</label>
                    <input
                      id="nama_siswa"
                      type="text"
                      required
                      value={formData.nama_siswa}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nama_siswa: e.target.value
                        })
                      }
                      placeholder="Masukkan nama siswa"
                    />

                    <label htmlFor="jurusan">Jurusan</label>
                    <select
                      id="jurusan"
                      required
                      value={formData.jurusan}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jurusan: e.target.value
                        })
                      }
                    >
                      <option value="">Pilih Jurusan</option>
                      <option value="IPA">IPA</option>
                      <option value="IPS">IPS</option>
                    </select>

                    <label htmlFor="tanggal_lahir">Tanggal Lahir</label>
                    <input
                      id="tanggal_lahir"
                      type="date"
                      required
                      value={formData.tanggal_lahir}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tanggal_lahir: e.target.value
                        })
                      }
                    />

                    <label htmlFor="alamat">Alamat</label>
                    <textarea
                      id="alamat"
                      required
                      value={formData.alamat}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          alamat: e.target.value
                        })
                      }
                      placeholder="Masukkan alamat siswa"
                    />

                    <div className="form-actions">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={tutupForm}
                        disabled={menyimpan}
                      >
                        Batal
                      </button>

                      <button
                        type="submit"
                        className="primary-button"
                        disabled={menyimpan}
                      >
                        {menyimpan
                          ? 'Menyimpan...'
                          : modeEdit
                            ? 'Simpan Perubahan'
                            : 'Simpan Data'}
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* PESAN ERROR PENGAMBILAN DATA */}
              {loading && <p>Memuat data siswa...</p>}

              {error && (
                <p className="error-message">{error}</p>
              )}

              {/* TABEL SISWA */}
              {!loading && !error && (
                <>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Kode Siswa</th>
                          <th>Nama Siswa</th>
                          <th>Jurusan</th>
                          <th>Tanggal Lahir</th>
                          <th>Alamat</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>

                      <tbody>
                        {siswaTersaring.length > 0 ? (
                          siswaTersaring.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>{item.kode_siswa}</td>
                              <td>{item.nama_siswa}</td>
                              <td>{item.jurusan}</td>
                              <td>{item.tanggal_lahir.slice(0, 10)}</td>
                              <td>{item.alamat}</td>
                              <td>
                                <div className="action-buttons">
                                  <button
                                    className="edit-button"
                                    onClick={() => bukaFormEdit(item)}
                                  >
                                    Edit
                                  </button>

                                  <button
                                    className="delete-button"
                                    onClick={() => hapusSiswa(item)}
                                  >
                                    Hapus
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7}>
                              Data siswa tidak ditemukan.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <p className="table-count">
                    Menampilkan {siswaTersaring.length} dari {siswa.length} siswa
                  </p>
                </>
              )}

            </section>
          </>
        )}

      </main>
    </div>
  )
}

export default App
