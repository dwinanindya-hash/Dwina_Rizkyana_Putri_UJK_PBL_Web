
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/database';
import siswaRoutes from './routes/siswaRoutes';

// Membaca konfigurasi dari file .env
dotenv.config();

// Membuat aplikasi Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/siswa', siswaRoutes);

// Menentukan port server
const PORT = process.env.PORT || 5000;

// Endpoint halaman utama
app.get('/', (req, res) => {
    res.json({
        message: 'Backend Pendataan Siswa Sekolah berhasil berjalan!'
    });
});


// Mengecek koneksi database
app.get('/test-db', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');

        res.json({
            message: 'Database berhasil terhubung!',
            waktu: result.rows[0].now
        });
    } catch (error) {
        console.error('Database error:', error);

        res.status(500).json({
            message: 'Koneksi database gagal'
        });
    }
});


// Menjalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
