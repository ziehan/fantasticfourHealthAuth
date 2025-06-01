import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream';

// Helper promisify untuk baca output child process
function runPython(pythonExecutable: string, pythonScriptPath: string, question: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn(pythonExecutable, [pythonScriptPath, question]);
    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(stderr || `Python process exited with code ${code}`));
      }
    });

    pythonProcess.on('error', (err) => {
      reject(err);
    });
  });
}

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Pertanyaan tidak valid atau hilang.' }, { status: 400 });
    }

    const projectRoot = process.cwd();
    const pythonScriptPath = path.join(projectRoot, 'src', 'backend', 'rag', 'query.py');
    const pythonExecutable = 'python'; // Sesuaikan sesuai lingkunganmu

    const responseData = await runPython(pythonExecutable, pythonScriptPath, question);

    return NextResponse.json({ answer: responseData });
  } catch (error: any) {
    console.error('[API Ask] Error di handler POST:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server.', details: error.message }, { status: 500 });
  }
}
