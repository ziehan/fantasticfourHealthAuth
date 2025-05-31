# my-project/ml_workspace/generate_dummy_surge_data.py
import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta

def generate_individual_patient_data(num_records=2000, num_days=90):
    """Generates dummy individual patient records."""
    np.random.seed(42)

    start_date = datetime(2024, 1, 1)
    kelurahan_list = [f'Kelurahan_{chr(65+i)}' for i in range(5)] # Kelurahan A, B, C, D, E
    faskes_list = [f'Faskes_{i}' for i in range(1, 4)] # Faskes 1, 2, 3
    jenis_kelamin_options = ['Laki-laki', 'Perempuan']
    
    # Kategori keluhan/gejala/dugaan penyakit (disederhanakan)
    keluhan_utama_options = ['Demam', 'Batuk/Pilek', 'Sakit Kepala', 'Diare', 'Nyeri Otot', 'Lemas']
    gejala_fisik_options = ['Suhu >37.5C', 'Ruam Kulit', 'Mual/Muntah', 'Sesak Napas Ringan'] # Bisa multiple
    dugaan_penyakit_options = ['ISPA Ringan', 'Influenza-like Illness (ILI)', 'Gastroenteritis Akut', 'Demam Biasa', 'Suspek DBD Ringan']
    status_vaksinasi_options = ['Lengkap Primer', 'Booster 1', 'Belum Vaksin', 'Tidak Tahu']
    riwayat_perjalanan_options = ['Tidak Ada', 'Dalam Kota', 'Luar Kota <14hr', 'Luar Negeri <14hr']
    status_akhir_options = ['Rawat Jalan', 'Dirujuk', 'Observasi IGD']

    data = []
    for i in range(num_records):
        record_date = start_date + timedelta(days=np.random.randint(0, num_days))
        usia_pasien = np.random.randint(1, 80)
        suhu_tubuh = round(np.random.normal(loc=37.5, scale=0.8), 1)
        domisili = np.random.choice(kelurahan_list)
        dugaan_penyakit = np.random.choice(dugaan_penyakit_options)

        # Simulasi potensi lonjakan untuk penyakit tertentu di wilayah tertentu pada periode tertentu
        # Misal: ILI di Kelurahan_B dan Kelurahan_C pada bulan Februari 2024
        is_surge_period_location = (
            (record_date.month == 2 and record_date.year == 2024) and
            (domisili in ['Kelurahan_B', 'Kelurahan_C'])
        )

        if is_surge_period_location and np.random.rand() < 0.6: # 60% kasus jadi ILI saat surge
            dugaan_penyakit = 'Influenza-like Illness (ILI)'
            suhu_tubuh = round(np.random.normal(loc=38.2, scale=0.5), 1)
            keluhan_utama = np.random.choice(['Demam', 'Batuk/Pilek', 'Nyeri Otot'])
        elif dugaan_penyakit == 'Influenza-like Illness (ILI)' and np.random.rand() < 0.7: # Kurangi ILI di luar surge
             dugaan_penyakit = np.random.choice(['ISPA Ringan', 'Demam Biasa'])


        data.append({
            'id_kunjungan_pasien': f'K{str(i+1).zfill(5)}',
            'id_pasien_internal': f'P{str(np.random.randint(1, num_records//2)).zfill(5)}', # Ada kemungkinan pasien sama datang lagi
            'id_faskes': np.random.choice(faskes_list),
            'tanggal_jam_kunjungan': record_date.strftime('%Y-%m-%d') + f' {np.random.randint(8,17):02d}:{np.random.randint(0,59):02d}',
            'tempat_tanggal_lahir': (record_date - timedelta(days=365.25 * usia_pasien)).strftime('%Y-%m-%d'), # Estimasi TTL
            'usia_pasien': usia_pasien, # Tambahan kolom usia untuk kemudahan
            'jenis_kelamin_pasien': np.random.choice(jenis_kelamin_options),
            'domisili_pasien_kelurahan_desa': domisili,
            'keluhan_utama_pasien': np.random.choice(keluhan_utama_options) if not (is_surge_period_location and dugaan_penyakit == 'Influenza-like Illness (ILI)') else keluhan_utama,
            'gejala_fisik_dialami': ", ".join(np.random.choice(gejala_fisik_options, np.random.randint(1,3), replace=False)),
            'tanggal_onset_gejala_pertama': (record_date - timedelta(days=np.random.randint(1,5))).strftime('%Y-%m-%d'),
            'suhu_tubuh_saat_pemeriksaan_celcius': suhu_tubuh,
            'dugaan_penyakit': dugaan_penyakit,
            'riwayat_penyakit_penyerta_komorbid': np.random.choice(['Tidak Ada', 'Hipertensi', 'Diabetes', 'Asma'], p=[0.7, 0.1, 0.1, 0.1]),
            'status_vaksinasi': np.random.choice(status_vaksinasi_options),
            'riwayat_perjalanan_14_hari_terakhir': np.random.choice(riwayat_perjalanan_options),
            'hasil_pemeriksaan_penunjang_kunci': np.random.choice(['Belum Ada Hasil', 'Dalam Proses', 'Normal', 'Leukositosis Ringan']),
            'tindakan_yang_diberikan': np.random.choice(['Edukasi & Simptomatik', 'Observasi', 'Pemberian Antibiotik (jika perlu)']),
            'status_akhir_pasien': np.random.choice(status_akhir_options)
        })
    df = pd.DataFrame(data)
    df['tanggal_kunjungan'] = pd.to_datetime(df['tanggal_jam_kunjungan']).dt.date
    print(f"Generated {len(df)} individual patient records.")
    return df

def aggregate_data_for_surge_prediction(patient_df, illness_keyword='ILI'):
    """Aggregates patient data per day and kelurahan to create features for surge prediction."""
    daily_aggregation = patient_df.groupby(['tanggal_kunjungan', 'domisili_pasien_kelurahan_desa']).agg(
        jumlah_total_kunjungan=('id_kunjungan_pasien', 'count'),
        rata_rata_suhu_tubuh=('suhu_tubuh_saat_pemeriksaan_celcius', 'mean'),
        jumlah_kasus_dengan_demam=('suhu_tubuh_saat_pemeriksaan_celcius', lambda x: (x >= 37.8).sum()), # Demam tinggi >= 37.8
        jumlah_kasus_illness_keyword=('dugaan_penyakit', lambda x: x.str.contains(illness_keyword, case=False).sum()),
        rata_usia_pasien=('usia_pasien', 'mean')
    ).reset_index()

    # Menambahkan fitur hari dalam seminggu dan bulan
    daily_aggregation['tanggal_kunjungan'] = pd.to_datetime(daily_aggregation['tanggal_kunjungan'])
    daily_aggregation['hari_ke_minggu'] = daily_aggregation['tanggal_kunjungan'].dt.dayofweek # Senin=0, Minggu=6
    daily_aggregation['bulan'] = daily_aggregation['tanggal_kunjungan'].dt.month

    # Mendefinisikan target 'is_surge'
    # Misal: lonjakan jika kasus ILI > 5 di suatu kelurahan pada hari itu ATAU total kunjungan > 10 dengan rata-rata suhu tinggi
    threshold_ili_cases = 3 
    threshold_total_visits_with_fever = 8
    avg_temp_threshold = 37.7

    daily_aggregation['is_surge_prediksi'] = np.where(
        (daily_aggregation['jumlah_kasus_illness_keyword'] > threshold_ili_cases) |
        ((daily_aggregation['jumlah_total_kunjungan'] > threshold_total_visits_with_fever) & (daily_aggregation['rata_rata_suhu_tubuh'] > avg_temp_threshold)),
        1, 0
    )
    
    # Tambah fitur lag sederhana (jumlah kasus ILI hari sebelumnya)
    # Penting: ini sederhana, untuk data yg tidak lengkap antar hari/kelurahan perlu penanganan lebih baik
    daily_aggregation = daily_aggregation.sort_values(by=['domisili_pasien_kelurahan_desa', 'tanggal_kunjungan'])
    daily_aggregation[f'jumlah_kasus_{illness_keyword}_kemarin'] = daily_aggregation.groupby('domisili_pasien_kelurahan_desa')[f'jumlah_kasus_illness_keyword'].shift(1).fillna(0)
    daily_aggregation[f'jumlah_total_kunjungan_kemarin'] = daily_aggregation.groupby('domisili_pasien_kelurahan_desa')[f'jumlah_total_kunjungan'].shift(1).fillna(0)


    print(f"\nAggregated data for surge prediction ({len(daily_aggregation)} rows):")
    print(daily_aggregation.head())
    print("\nDistribution of 'is_surge_prediksi':")
    print(daily_aggregation['is_surge_prediksi'].value_counts(normalize=True))
    
    return daily_aggregation


if __name__ == "__main__":
    # Folder penyimpanan data (relatif terhadap skrip)
    # Asumsi skrip ini dijalankan dari dalam folder 'ml_workspace'
    data_folder = 'data_penyakit' 
    if not os.path.exists(data_folder):
        os.makedirs(data_folder)

    # 1. Generate data pasien individual (opsional untuk disimpan)
    individual_data = generate_individual_patient_data(num_records=5000, num_days=120) # Misal 5000 record dalam 120 hari
    # individual_file_path = os.path.join(data_folder, 'dummy_individual_patient_records.csv')
    # individual_data.to_csv(individual_file_path, index=False)
    # print(f"\nIndividual patient data saved to {individual_file_path}")

    # 2. Agregasi data untuk prediksi lonjakan (ini yang akan dipakai model)
    # Fokus pada prediksi lonjakan "Influenza-like Illness (ILI)"
    aggregated_surge_data = aggregate_data_for_surge_prediction(individual_data, illness_keyword='ILI')
    
    # Pastikan tidak ada NaN di fitur yang akan dipakai (misal dari lag)
    # Untuk kesederhanaan, kita drop baris dengan NaN yang mungkin muncul dari fitur lag di awal periode per kelurahan
    original_len = len(aggregated_surge_data)
    aggregated_surge_data.dropna(subset=[
        'jumlah_kasus_ILI_kemarin', 'jumlah_total_kunjungan_kemarin', 'rata_rata_suhu_tubuh'
        ], inplace=True)
    if len(aggregated_surge_data) < original_len:
        print(f"Dropped {original_len - len(aggregated_surge_data)} rows with NaNs after lag feature creation.")


    aggregated_file_path = os.path.join(data_folder, 'dummy_aggregated_disease_surge_data.csv')
    aggregated_surge_data.to_csv(aggregated_file_path, index=False)
    print(f"\nAggregated data for surge prediction saved to {aggregated_file_path}")
    print("\nContoh beberapa baris data agregat yang disimpan:")
    print(aggregated_surge_data.head())
    print(f"\nKolom yang tersedia di data agregat: {aggregated_surge_data.columns.tolist()}")