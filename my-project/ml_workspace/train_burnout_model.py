# my-project/ml_workspace/train_burnout_model.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

def preprocess_features(df_features):
    # ... (kode ini sudah benar) ...
    """Defines the preprocessing steps for numerical features."""
    numerical_features = [
        'jam_kerja_mingguan', 'jumlah_pasien_harian',
        'skor_self_assessment_stres', 'skor_kepuasan_kerja',
        'lama_bertugas_di_3T_bulan', 'dukungan_supervisor_skor'
    ]
    existing_numerical_features = [col for col in numerical_features if col in df_features.columns]
    if not existing_numerical_features:
        return ColumnTransformer(transformers=[], remainder='passthrough'), []
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), existing_numerical_features)
        ],
        remainder='passthrough'
    )
    return preprocessor, existing_numerical_features

# PERUBAHAN DI SINI:
def train_model(data_path='data/dummy_nakes_burnout_data.csv'): # Path relatif diperbaiki
    """Loads data, preprocesses, trains a model, evaluates, and saves it."""

    print(f"Loading data from {data_path}...")
    # Asumsi skrip ini dijalankan dari dalam folder 'ml_workspace'
    if not os.path.exists(data_path):
        print(f"Error: Data file not found at {data_path}. Please run generate_dummy_data.py first.")
        return None, None

    # ... (sisa kode train_model sudah benar) ...
    df = pd.read_csv(data_path)
    X = df.drop(['nakes_id', 'risiko_burnout'], axis=1)
    y = df['risiko_burnout']
    print("Defining features and target...")
    print(f"Features (X) shape: {X.shape}")
    print(f"Target (y) shape: {y.shape}")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    print(f"Training set size: {X_train.shape[0]}, Test set size: {X_test.shape[0]}")
    preprocessor, numerical_cols_used_in_training = preprocess_features(X_train.copy())
    if not numerical_cols_used_in_training:
        print("Error: No numerical features found or defined for preprocessing.")
        return None, None
    model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    pipeline = Pipeline(steps=[('preprocessor', preprocessor),
                               ('classifier', model)])
    print("Training the model...")
    pipeline.fit(X_train, y_train)
    print("Model training complete.")
    print("\nEvaluating model on the test set...")
    y_pred = pipeline.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, target_names=['Rendah', 'Sedang', 'Tinggi'], zero_division=0)
    print(f"Accuracy: {accuracy:.4f}")
    print("Classification Report:\n", report)
    print("NOTE: These metrics are based on DUMMY data and are for illustrative purposes only.")
    models_folder = 'models/saved_models'
    # Membuat folder 'models/saved_models' di dalam 'ml_workspace' jika belum ada
    if not os.path.exists(models_folder):
        os.makedirs(models_folder)
    model_filename = os.path.join(models_folder, 'burnout_prediction_pipeline.joblib')
    joblib.dump(pipeline, model_filename)
    print(f"\nTrained pipeline (preprocessor + model) saved to: {model_filename}")
    return pipeline, numerical_cols_used_in_training


# ... (fungsi predict_new_data sudah benar) ...
def predict_new_data(pipeline_model, new_data_dict, feature_names_from_training):
    """
    Makes predictions for new data using the trained pipeline.
    pipeline_model: The loaded joblib pipeline.
    new_data_dict: A dictionary or list of dictionaries with new data.
    feature_names_from_training: List of numerical feature names used during training
                                 to ensure correct DataFrame structure.
    """
    if pipeline_model is None:
        print("Pipeline model is not available.")
        return None, None
    new_df_input_data = {}
    for feature in feature_names_from_training:
        new_df_input_data[feature] = [new_data_dict.get(feature, np.nan)]
    new_df = pd.DataFrame(new_df_input_data, index=[0])
    print(f"\nMaking prediction for new data: {new_data_dict}")
    print(f"DataFrame sent to pipeline: \n{new_df}")
    prediction_proba = pipeline_model.predict_proba(new_df)
    prediction_class = pipeline_model.predict(new_df)
    class_mapping = {0: 'Rendah', 1: 'Sedang', 2: 'Tinggi'}
    predicted_label = class_mapping.get(prediction_class[0], "Tidak Diketahui")
    print(f"Predicted class index: {prediction_class[0]}")
    print(f"Predicted label: {predicted_label}")
    print(f"Prediction probabilities (Rendah, Sedang, Tinggi): {prediction_proba[0]}")
    return predicted_label, prediction_proba[0]

if __name__ == "__main__":
    trained_pipeline, numerical_features_list_from_training = train_model()

    if trained_pipeline and numerical_features_list_from_training:
        # Load model yang disimpan untuk simulasi penggunaan di aplikasi lain
        loaded_pipeline = joblib.load('models/saved_models/burnout_prediction_pipeline.joblib')
        print("\n--- Testing prediction with loaded pipeline ---")
        
        sample_high_risk_data = {
            'jam_kerja_mingguan': 65,
            'jumlah_pasien_harian': 40,
            'skor_self_assessment_stres': 8,
            'skor_kepuasan_kerja': 3,
            'lama_bertugas_di_3T_bulan': 24,
            'dukungan_supervisor_skor': 2
        }
        predicted_risk_1, _ = predict_new_data(loaded_pipeline, sample_high_risk_data, numerical_features_list_from_training)
        print(f"Hasil prediksi untuk data nakes (high risk sample): Risiko Burnout = {predicted_risk_1}")

        sample_low_risk_data = {
            'jam_kerja_mingguan': 40,
            'jumlah_pasien_harian': 15,
            'skor_self_assessment_stres': 3,
            'skor_kepuasan_kerja': 8,
            'lama_bertugas_di_3T_bulan': 6,
            'dukungan_supervisor_skor': 6
        }
        predicted_risk_2, _ = predict_new_data(loaded_pipeline, sample_low_risk_data, numerical_features_list_from_training)
        print(f"Hasil prediksi untuk data nakes (low risk sample): Risiko Burnout = {predicted_risk_2}")