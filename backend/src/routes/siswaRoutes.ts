import express from 'express';
import db from '../config/database';

const router = express.Router();

// API untuk menampilkan seluruh data siswa
router.get('/', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM siswa ORDER BY id ASC'
        );

        res.json({
            message: 'Data siswa berhasil ditampilkan',
            data: result.rows
        });
    } catch (error) {
        console.error('Gagal mengambil data siswa:', error);

        res.status(500).json({
            message: 'Gagal mengambil data siswa'
        });
    }
});

// API untuk menambahkan data siswa
router.post('/', async (req, res) => {
    try {
        const {
            kode_siswa,
            nama_siswa,
            jurusan,
            tanggal_lahir,
            alamat
        } = req.body;

        const result = await db.query(
            `INSERT INTO siswa (
                kode_siswa,
                nama_siswa,
                jurusan,
                tanggal_lahir,
                alamat
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                kode_siswa,
                nama_siswa,
                jurusan,
                tanggal_lahir,
                alamat
            ]
        );

        res.status(201).json({
            message: 'Data siswa berhasil ditambahkan',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Gagal menambahkan data siswa:', error);

        res.status(500).json({
            message: 'Gagal menambahkan data siswa'
        });
    }
});

// API untuk mengubah data siswa
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const {
            kode_siswa,
            nama_siswa,
            jurusan,
            tanggal_lahir,
            alamat
        } = req.body;

        const result = await db.query(
            `UPDATE siswa
             SET kode_siswa = $1,
                 nama_siswa = $2,
                 jurusan = $3,
                 tanggal_lahir = $4,
                 alamat = $5,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $6
             RETURNING *`,
            [
                kode_siswa,
                nama_siswa,
                jurusan,
                tanggal_lahir,
                alamat,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Data siswa tidak ditemukan'
            });
        }

        res.json({
            message: 'Data siswa berhasil diubah',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Gagal mengubah data siswa:', error);

        res.status(500).json({
            message: 'Gagal mengubah data siswa'
        });
    }
}); 

// API untuk menghapus data siswa
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'DELETE FROM siswa WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Data siswa tidak ditemukan'
            });
        }

        res.json({
            message: 'Data siswa berhasil dihapus',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Gagal menghapus data siswa:', error);

        res.status(500).json({
            message: 'Gagal menghapus data siswa'
        });
    }
});

export default router;