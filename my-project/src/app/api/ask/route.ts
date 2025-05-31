// src/app/api/ask/route.ts
import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Pertanyaan tidak valid atau hilang.' }, { status: 400 });
    }

    // Path ke direktori root proyek Anda
    const projectRoot = process.cwd();
    // Path ke skrip Python Anda
    const pythonScriptPath = path.join(projectRoot, 'src', 'backend', 'rag', 'query.py');

    // --- PENTING: Tentukan path ke interpreter Python Anda ---
    // Jika Anda menggunakan virtual environment (venv) untuk Python:
    // const pythonExecutable = path.join(projectRoot, 'venv', 'Scripts', 'python.exe'); // Contoh untuk Windows venv di root
    // const pythonExecutable = path.join(projectRoot, 'venv', 'bin', 'python'); // Contoh untuk Linux/macOS venv di root
    // Jika Python ada di PATH sistem dan venv aktif di terminal tempat Next.js dijalankan:
    const pythonExecutable = 'python'; // ATAU 'python3'. Sesuaikan ini!

    console.log(`[API Ask] Akan menjalankan: <span class="math-inline">\{pythonExecutable\} "</span>{pythonScriptPath}" "${question}"`);

    // Menggunakan Promise untuk menangani proses asynchronous dari child process
    return new Promise((resolve) => {
      const pythonProcess = spawn(pythonExecutable, [pythonScriptPath, question]);

      let responseData = ''; // Untuk stdout
      let errorData = '';    // Untuk stderr

      // Tangkap output dari stdout skrip Python
      pythonProcess.stdout.on('data', (data) => {
        responseData += data.toString();
      });

      // Tangkap output dari stderr skrip Python (untuk logging atau error)
      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
        console.error(`[API Ask] stderr dari Python: ${data.toString().trim()}`); // Log error dari Python
      });

      // Tangani ketika proses Python selesai
      pythonProcess.on('close', (code) => {
        console.log(`[API Ask] Python process exited with code ${code}`);
        if (code === 0 && responseData) {
          // Jika sukses dan ada data di stdout
          resolve(NextResponse.json({ answer: responseData.trim() }));
        } else {
          // Jika ada error code atau tidak ada responseData yang valid
          let errorMessage = `Gagal mendapatkan jawaban dari skrip Python (exit code: ${code}).`;
          if (errorData) { // Prioritaskan pesan error dari stderr jika ada
            errorMessage = errorData.trim();
            // Cek apakah errorData adalah pesan error spesifik dari skrip Python
            if (errorMessage.startsWith("ERROR_") || errorMessage.startsWith("WARNING_")) {
               // Biarkan pesan error dari skrip Python apa adanya
            } else {
               errorMessage = `Error dari Python: ${errorMessage}`;
            }
          } else if (responseData) { // Jika ada sesuatu di stdout tapi exit code bukan 0
            errorMessage = `Masalah pada skrip Python, output: ${responseData.trim()}`;
          }
          resolve(NextResponse.json({ error: errorMessage }, { status: 500 }));
        }
      });

      // Tangani error jika proses Python gagal dimulai
      pythonProcess.on('error', (err) => {
        console.error('[API Ask] Gagal memulai proses Python:', err);
        resolve(NextResponse.json({ error: 'Server gagal menjalankan proses AI.', details: err.message }, { status: 500 }));
      });
    });

  } catch (error: any) {
    console.error('[API Ask] Error di handler POST:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server.', details: error.message }, { status: 500 });
  }
}