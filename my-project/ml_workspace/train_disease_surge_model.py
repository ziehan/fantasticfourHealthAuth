# my-project/ml_workspace/train_disease_surge_model.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import joblib
import os
import seaborn as sns
import matplotlib.pyplot as plt

def preprocess_surge_features(df_features):
    """Defines preprocessing for numerical and categorical features for surge model."""
    
    numerical_features = [
        'rata_rata_suhu_tubuh', 'jumlah_kasus_dengan_demam',
        'jumlah_kasus_ILI_kemarin', 'jumlah_total_kunjungan_kemarin', # Contoh fitur lag
        'rata_usia_pasien', 'jumlah_total_kunjungan', 'jumlah_kasus_illness_keyword'
    ]
    # Fitur tanggal sudah dipecah menjadi numerik (hari_ke_minggu, bulan) jadi bisa dimasukkan ke numerical
    # atau dibiarkan saja jika skalanya sudah sesuai. Di sini kita masukkan ke standard scaler.
    # Jika tidak ingin di-scale, bisa dipisah atau pakai 'passthrough'
    date_numerical_features = ['hari_ke_minggu', 'bulan']
    
    categorical_features = [
        'domisili_pasien_kelurahan_desa'
    ]

    # Filter fitur yang ada di DataFrame
    existing_numerical_features = [col for col in numerical_features if col in df_features.columns]
    existing_date_numerical_features = [col for col in date_numerical_features if col in df_features.columns]
    existing_categorical_features = [col for col in categorical_features if col in df_features.columns]
    
    all_numerical_to_scale = existing_numerical_features + existing_date_numerical_features

    transformers_list = []
    if all_numerical_to_scale:
        transformers_list.append(('num', StandardScaler(), all_numerical_to_scale))
    if existing_categorical_features:
        transformers_list.append(('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), existing_categorical_features))

    if not transformers_list:
        return ColumnTransformer(transformers=[], remainder='passthrough'), [], []

    preprocessor = ColumnTransformer(
        transformers=transformers_list,
        remainder='drop' # 'passthrough' jika ada kolom lain yang ingin dipertahankan tanpa diubah
    )
    
    # Mengembalikan juga list nama fitur yang dipakai untuk memastikan konsistensi saat prediksi
    used_features = all_numerical_to_scale + existing_categorical_features
    return preprocessor, used_features, all_numerical_to_scale, existing_categorical_features


def train_surge_model(data_path='data_penyakit/dummy_aggregated_disease_surge_data.csv'):
    """Loads aggregated data, preprocesses, trains a surge prediction model, evaluates, and saves it."""

    print(f"Loading aggregated data from {data_path}...")
    # Asumsi skrip ini dijalankan dari dalam folder 'ml_workspace'
    if not os.path.exists(data_path):
        print(f"Error: Aggregated data file not found at {data_path}. Please run generate_dummy_surge_data.py first.")
        return None, None, None, None

    df = pd.read_csv(data_path)
    
    # Pastikan kolom tanggal jika ada, sudah jadi numerik (hari, bulan) atau di-drop jika tidak dipakai langsung
    # 'tanggal_kunjungan' sudah di-drop jika hanya dipakai untuk membuat 'hari_ke_minggu' dan 'bulan'
    # Jika 'tanggal_kunjungan' masih ada dan bertipe datetime, perlu di-handle atau di-drop.
    # Di sini kita asumsikan sudah jadi fitur numerik atau tidak ada.
    
    # Definisikan fitur (X) dan target (y)
    # Target adalah 'is_surge_prediksi'
    # Fitur adalah semua kolom lain yang relevan (tidak termasuk ID atau tanggal mentah)
    target_column = 'is_surge_prediksi'
    
    # Hati-hati, jika 'jumlah_kasus_illness_keyword' dipakai untuk membuat target, mungkin ada kebocoran data.
    # Untuk contoh ini, kita asumsikan definisi 'is_surge_prediksi' cukup kompleks sehingga tidak hanya bergantung pada satu fitur ini.
    # Idealnya, fitur untuk X tidak secara langsung mendefinisikan Y.
    # Kita akan drop 'tanggal_kunjungan' karena sudah diekstrak ke hari_ke_minggu dan bulan.
    potential_features = df.drop(columns=[target_column, 'tanggal_kunjungan'], errors='ignore')
    
    X = potential_features
    y = df[target_column]

    print("Defining features and target...")
    print(f"Features (X) shape: {X.shape}, Columns: {X.columns.tolist()}")
    print(f"Target (y) shape: {y.shape}")

    if X.empty:
        print("Error: No features found after dropping target and date columns.")
        return None, None, None, None
        
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)
    print(f"Training set size: {X_train.shape[0]}, Test set size: {X_test.shape[0]}")

    preprocessor, used_feature_names, numerical_cols_used, categorical_cols_used = preprocess_surge_features(X_train.copy())

    if not used_feature_names:
        print("Error: No features defined or found for preprocessing.")
        return None, None, None, None

    # Model: RandomForestClassifier
    # Kita bisa tambahkan hyperparameter tuning sederhana
    param_grid = {
        'classifier__n_estimators': [100, 150],
        'classifier__max_depth': [5, 10, None],
        'classifier__min_samples_leaf': [2, 4]
    }
    
    # Cek class balance untuk class_weight
    class_counts = y_train.value_counts(normalize=True)
    print(f"Class distribution in training data:\n{class_counts}")
    # Jika sangat tidak seimbang, pertimbangkan class_weight='balanced' atau teknik SMOTE (di luar pipeline ini)
    model = RandomForestClassifier(random_state=42, class_weight='balanced' if class_counts.min() < 0.3 else None)


    pipeline = Pipeline(steps=[('preprocessor', preprocessor),
                               ('classifier', model)])
    
    grid_search = GridSearchCV(pipeline, param_grid, cv=3, scoring='roc_auc', n_jobs=-1, verbose=1) # atau 'f1_weighted' untuk imbalanced

    print("Training the model with GridSearchCV...")
    try:
        grid_search.fit(X_train, y_train)
    except ValueError as e:
        print(f"Error during model training: {e}")
        print("This might be due to empty feature sets after preprocessing.")
        print(f"X_train columns: {X_train.columns.tolist()}")
        print(f"Numerical features for preprocessor: {numerical_cols_used}")
        print(f"Categorical features for preprocessor: {categorical_cols_used}")
        return None, None, None, None

    print(f"Best parameters found: {grid_search.best_params_}")
    best_pipeline = grid_search.best_estimator_
    
    print("Model training complete.")

    print("\nEvaluating model on the test set...")
    y_pred = best_pipeline.predict(X_test)
    y_pred_proba = best_pipeline.predict_proba(X_test)[:, 1] # Probabilitas kelas positif (surge)

    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, target_names=['No Surge', 'Surge'], zero_division=0)
    
    print(f"Accuracy: {accuracy:.4f}")
    print("Classification Report:\n", report)
    
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(6,4))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=['No Surge', 'Surge'], yticklabels=['No Surge', 'Surge'])
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.title('Confusion Matrix')
    confusion_matrix_path = 'reports/surge_confusion_matrix.png'
    os.makedirs('reports', exist_ok=True) # Pastikan folder reports ada
    plt.savefig(confusion_matrix_path)
    print(f"Confusion matrix saved to {confusion_matrix_path}")
    plt.show()


    print("NOTE: These metrics are based on DUMMY data and are for illustrative purposes only.")
    
    models_folder = 'models/saved_surge_models'
    # Membuat folder jika belum ada
    if not os.path.exists(models_folder):
        os.makedirs(models_folder)
        
    model_filename = os.path.join(models_folder, 'disease_surge_prediction_pipeline.joblib')
    joblib.dump(best_pipeline, model_filename)
    print(f"\nTrained pipeline (preprocessor + model) saved to: {model_filename}")

    # Menyimpan juga daftar fitur yang digunakan saat training, dan detail preprocessor
    # Ini penting untuk memastikan konsistensi saat memprediksi data baru.
    training_info = {
        'used_feature_names': used_feature_names, # Semua fitur yang masuk ke preprocessor
        'numerical_features_scaled': numerical_cols_used, # Hanya fitur numerik yang di-scale
        'categorical_features_onehot': categorical_cols_used, # Hanya fitur kategori yang di-OHE
        'target_name': target_column
    }
    info_filename = os.path.join(models_folder, 'training_info_surge.joblib')
    joblib.dump(training_info, info_filename)
    print(f"Training info (feature names, etc.) saved to: {info_filename}")
    
    return best_pipeline, used_feature_names, numerical_cols_used, categorical_cols_used


def predict_new_surge_data(pipeline_model, new_data_dict, feature_names_from_training, numerical_features_scaled, categorical_features_onehot):
    """
    Makes predictions for new aggregated daily data using the trained surge pipeline.
    new_data_dict: A dictionary representing one day's aggregated data for one region.
    feature_names_from_training: List of ALL feature names expected by the preprocessor in the pipeline.
    numerical_features_scaled: List of numerical feature names that were scaled.
    categorical_features_onehot: List of categorical feature names that were one-hot encoded.
    """
    if pipeline_model is None:
        print("Pipeline model is not available.")
        return None, None

    # Membuat DataFrame dari input dictionary, memastikan semua kolom ada dan dalam urutan yang benar
    # seperti saat training (sebelum preprocessing).
    # Kolom yang tidak ada di new_data_dict tapi ada di feature_names_from_training akan diisi NaN
    # (preprocessor harus bisa menangani ini, misal imputer atau jika fitur lag memang NaN).
    
    new_df_input_data = {}
    for feature in feature_names_from_training:
        new_df_input_data[feature] = [new_data_dict.get(feature, np.nan)] # np.nan jika fitur tidak ada
        
    new_df = pd.DataFrame(new_df_input_data, index=[0])
    
    # Pastikan tipe data sesuai dengan ekspektasi preprocessor
    # Numerik harus numerik, kategori harus string/object
    for col in numerical_features_scaled:
        if col in new_df.columns:
            new_df[col] = pd.to_numeric(new_df[col], errors='coerce')
    for col in categorical_features_onehot:
         if col in new_df.columns:
            new_df[col] = new_df[col].astype(str) # OHE biasanya handle string

    print(f"\nMaking prediction for new aggregated data: {new_data_dict}")
    print(f"DataFrame sent to pipeline: \n{new_df[feature_names_from_training]}") # Tampilkan dengan urutan fitur training
    
    try:
        prediction_proba = pipeline_model.predict_proba(new_df)
        prediction_class = pipeline_model.predict(new_df)
    except Exception as e:
        print(f"Error during prediction: {e}")
        print("Ensure new data has all required features and correct types.")
        print(f"Required features: {feature_names_from_training}")
        print(f"Data provided for prediction:\n{new_df}")
        return None, None

    class_mapping = {0: 'No Surge', 1: 'Surge'}
    predicted_label = class_mapping.get(prediction_class[0], "Tidak Diketahui")
    
    print(f"Predicted class index: {prediction_class[0]}")
    print(f"Predicted label: {predicted_label}")
    print(f"Prediction probabilities (No Surge, Surge): {prediction_proba[0]}")
    
    return predicted_label, prediction_proba[0]


if __name__ == "__main__":
    # Jalankan training
    trained_surge_pipeline, features_list_training, num_cols_training, cat_cols_training = train_surge_model()

    if trained_surge_pipeline and features_list_training:
        # Load model dan info training yang disimpan untuk simulasi penggunaan
        # Ini adalah praktik yang baik untuk memastikan konsistensi
        loaded_pipeline = joblib.load('models/saved_surge_models/disease_surge_prediction_pipeline.joblib')
        training_info_loaded = joblib.load('models/saved_surge_models/training_info_surge.joblib')
        
        # Ambil nama fitur dari info yang disimpan
        loaded_feature_names = training_info_loaded['used_feature_names']
        loaded_numerical_features = training_info_loaded['numerical_features_scaled']
        loaded_categorical_features = training_info_loaded['categorical_features_onehot']

        print("\n--- Testing prediction with loaded pipeline and training info ---")
        
        # Contoh data baru (agregat harian untuk satu kelurahan)
        # Sesuaikan nama fitur dengan yang digunakan saat training (lihat output 'Features (X) shape: ... Columns: [...]' dari train_surge_model)
        # atau dari 'used_feature_names' yang disimpan.
        
        # Skenario 1: Potensi Lonjakan
        sample_high_surge_potential_data = {
            'domisili_pasien_kelurahan_desa': 'Kelurahan_B', # Salah satu kelurahan dari training data
            'jumlah_total_kunjungan': 15,
            'rata_rata_suhu_tubuh': 38.1,
            'jumlah_kasus_dengan_demam': 8,
            'jumlah_kasus_illness_keyword': 6, # Misal ILI
            'rata_usia_pasien': 35,
            'hari_ke_minggu': 2, # Rabu
            'bulan': 2, # Februari
            'jumlah_kasus_ILI_kemarin': 4, # Contoh fitur lag
            'jumlah_total_kunjungan_kemarin': 12
        }
        
        # Pastikan sample_high_surge_potential_data memiliki semua fitur yang ada di 'loaded_feature_names'
        # Jika tidak, fungsi predict_new_surge_data akan mengisinya dengan NaN.
        # Ini penting jika ada fitur yang tidak selalu ada di input baru.

        predicted_surge_1, proba_1 = predict_new_surge_data(
            loaded_pipeline, 
            sample_high_surge_potential_data, 
            loaded_feature_names,
            loaded_numerical_features,
            loaded_categorical_features
        )
        if predicted_surge_1:
            print(f"Hasil prediksi untuk data agregat (potensi lonjakan): Status = {predicted_surge_1}, Probabilitas Lonjakan = {proba_1[1]:.4f}")

        # Skenario 2: Normal
        sample_normal_day_data = {
            'domisili_pasien_kelurahan_desa': 'Kelurahan_A',
            'jumlah_total_kunjungan': 5,
            'rata_rata_suhu_tubuh': 37.2,
            'jumlah_kasus_dengan_demam': 1,
            'jumlah_kasus_illness_keyword': 0,
            'rata_usia_pasien': 40,
            'hari_ke_minggu': 4, # Jumat
            'bulan': 3, # Maret
            'jumlah_kasus_ILI_kemarin': 1,
            'jumlah_total_kunjungan_kemarin': 6
        }
        predicted_surge_2, proba_2 = predict_new_surge_data(
            loaded_pipeline, 
            sample_normal_day_data, 
            loaded_feature_names,
            loaded_numerical_features,
            loaded_categorical_features
        )
        if predicted_surge_2:
            print(f"Hasil prediksi untuk data agregat (hari normal): Status = {predicted_surge_2}, Probabilitas Lonjakan = {proba_2[1]:.4f}")

    else:
        print("Model training failed or did not complete. Skipping prediction tests.")