# my-project/ml_workspace/generate_dummy_data.py
import pandas as pd
import numpy as np
import os

def generate_data(num_samples=1000):
    """Generates dummy data for nakes burnout prediction."""

    np.random.seed(42) # Untuk hasil yang reproduktif

    data = pd.DataFrame({
        'nakes_id': [f'N{str(i).zfill(3)}' for i in range(num_samples)],
        'jam_kerja_mingguan': np.random.randint(30, 75, num_samples), # Jam kerja 30-75
        'jumlah_pasien_harian': np.random.randint(5, 50, num_samples), # Pasien per hari
        'skor_self_assessment_stres': np.random.randint(1, 11, num_samples), # Skala 1-10
        'skor_kepuasan_kerja': np.random.randint(1, 11, num_samples), # Skala 1-10
        'lama_bertugas_di_3T_bulan': np.random.randint(1, 60, num_samples), # 1 bulan - 5 tahun
        'dukungan_supervisor_skor': np.random.randint(1, 8, num_samples) # Skala 1-7
    })

    # Membuat label 'risiko_burnout' berdasarkan aturan sederhana (ini sangat disederhanakan)
    # 0: Rendah, 1: Sedang, 2: Tinggi
    conditions = [
        (data['jam_kerja_mingguan'] > 60) & (data['skor_self_assessment_stres'] > 7) & (data['skor_kepuasan_kerja'] < 4),
        (data['jam_kerja_mingguan'] > 50) & (data['skor_self_assessment_stres'] > 5) | (data['dukungan_supervisor_skor'] < 3),
        (data['jam_kerja_mingguan'] <= 50) & (data['skor_self_assessment_stres'] <= 5)
    ]
    choices = [2, 1, 0] # 2: Tinggi, 1: Sedang, 0: Rendah
    data['risiko_burnout'] = np.select(conditions, choices, default=1)

    # Sedikit noise pada label untuk membuatnya tidak terlalu deterministik
    noise_level = 0.1
    num_noise_samples = int(noise_level * num_samples)
    noise_indices = np.random.choice(data.index, num_noise_samples, replace=False)
    data.loc[noise_indices, 'risiko_burnout'] = np.random.choice([0, 1, 2], num_noise_samples)

    print(f"Generated {num_samples} samples.")
    print("Distribution of risiko_burnout:")
    print(data['risiko_burnout'].value_counts(normalize=True))
    
    return data

if __name__ == "__main__":
    data_folder = 'data'
    # Membuat folder 'data' di dalam 'ml_workspace' jika belum ada
    # Asumsi skrip ini dijalankan dari dalam folder 'ml_workspace'
    if not os.path.exists(data_folder):
        os.makedirs(data_folder)

    dummy_df = generate_data(num_samples=500)
    file_path = os.path.join(data_folder, 'dummy_nakes_burnout_data.csv')
    dummy_df.to_csv(file_path, index=False)
    print(f"Dummy data saved to {file_path} (relative to script location)")