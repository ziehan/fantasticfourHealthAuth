# backend/rag/embed.py
import os
import sys       # Impor modul sys
import traceback # Impor modul traceback
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings # Pastikan sudah pip install langchain-huggingface
from langchain.text_splitter import RecursiveCharacterTextSplitter

# --- Memuat variabel lingkungan dari file .env (Opsional, jika diperlukan untuk konfigurasi lain) ---
script_path_embed = os.path.abspath(__file__)
project_root_embed = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(script_path_embed))))
dotenv_path_embed = os.path.join(project_root_embed, '.env')

# print(f"[embed.py] Path skrip: {script_path_embed}")
# print(f"[embed.py] Project root: {project_root_embed}")
# print(f"[embed.py] Mencoba memuat .env dari: {dotenv_path_embed}")
if os.path.exists(dotenv_path_embed):
    load_dotenv(dotenv_path_embed)
    # print("[embed.py] .env dimuat.")
# else:
    # print(f"[embed.py] .env TIDAK ditemukan di {dotenv_path_embed}.")

# --- Konfigurasi Model Embedding ---
embedding_model_name_embed = "sentence-transformers/all-MiniLM-L6-v2"
model_kwargs_embed = {'device': 'cpu'}
encode_kwargs_embed = {'normalize_embeddings': True}

# print(f"[embed.py] Menginisialisasi model embedding dari Hugging Face: {embedding_model_name_embed}")
try:
    embeddings_model = HuggingFaceEmbeddings(
        model_name=embedding_model_name_embed,
        model_kwargs=model_kwargs_embed,
        encode_kwargs=encode_kwargs_embed
    )
    # print("[embed.py] Model embedding berhasil diinisialisasi.")
except Exception as e_emb:
    print(f"ERROR_INITIALIZING_EMBEDDING_MODEL: Gagal menginisialisasi model embedding - {str(e_emb)}", file=sys.stderr)
    traceback.print_exc(file=sys.stderr)
    sys.exit(1)


# --- Konfigurasi Text Splitter ---
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)

# --- Path ke Direktori Dokumen dan Memproses Semua PDF ---
script_dir_embed = os.path.dirname(script_path_embed)
documents_dir_embed = os.path.join(script_dir_embed, "documents")

if not os.path.exists(documents_dir_embed):
    print(f"ERROR_DOCUMENTS_DIR_NOT_FOUND: Direktori dokumen tidak ditemukan di {documents_dir_embed}", file=sys.stderr)
    sys.exit(1)

pdf_files_embed = [f for f in os.listdir(documents_dir_embed) if f.lower().endswith(".pdf")]

if not pdf_files_embed:
    print(f"Tidak ada file PDF yang ditemukan di direktori: {documents_dir_embed}")
    sys.exit(1)

print(f"[embed.py] Memproses file PDF berikut: {pdf_files_embed}")

all_docs_from_all_pdfs = []

for pdf_file_name_embed in pdf_files_embed:
    pdf_path_embed = os.path.join(documents_dir_embed, pdf_file_name_embed)
    print(f"[embed.py] Memuat dan memproses: {pdf_path_embed}...")
    try:
        loader = PyPDFLoader(pdf_path_embed)
        pages = loader.load_and_split(text_splitter=splitter)
        all_docs_from_all_pdfs.extend(pages)
        print(f"[embed.py] Selesai memproses {pdf_file_name_embed}, jumlah potongan: {len(pages)}")
    except Exception as e_pdf:
        print(f"Gagal memproses {pdf_file_name_embed}: {e_pdf}", file=sys.stderr) # Menggunakan sys.stderr
        traceback.print_exc(file=sys.stderr) # Menggunakan sys.stderr
        continue

if not all_docs_from_all_pdfs:
    print("Tidak ada dokumen yang berhasil diproses dari semua PDF.")
    sys.exit(1)

print(f"[embed.py] Total potongan dokumen dari semua PDF: {len(all_docs_from_all_pdfs)}")

# --- Membuat dan menyimpan vector store ---
try:
    print("[embed.py] Membuat vector store dari semua dokumen...")
    vectorstore = FAISS.from_documents(all_docs_from_all_pdfs, embeddings_model)
    
    vectorstore_save_path = os.path.join(script_dir_embed, "vectorstore_faiss_hf_multi")
    vectorstore.save_local(vectorstore_save_path)
    print(f"[embed.py] Vector store (multi-PDF) berhasil dibuat dan disimpan di: {vectorstore_save_path}")
except Exception as e_vs_save:
    print(f"Terjadi error saat membuat atau menyimpan vector store (multi-PDF): {e_vs_save}", file=sys.stderr) # Menggunakan sys.stderr
    traceback.print_exc(file=sys.stderr) # Menggunakan sys.stderr
    sys.exit(1) # Menggunakan sys.exit