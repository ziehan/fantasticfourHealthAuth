# backend/rag/query.py
import os
import sys # Untuk membaca argumen command-line
import traceback # Untuk debugging error
from dotenv import load_dotenv

from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate # Impor untuk custom prompt
from langchain_huggingface import HuggingFaceEmbeddings # Impor yang sudah diperbarui
from langchain_community.vectorstores import FAISS
# Menggunakan HuggingFacePipeline dari langchain_huggingface (sesuai saran deprecation)
from langchain_huggingface import HuggingFacePipeline # Impor yang sudah diperbarui
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

# --- Memuat variabel lingkungan (jika ada konfigurasi lain) ---
script_path_query = os.path.abspath(__file__)
project_root_query = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(script_path_query))))
dotenv_path_query = os.path.join(project_root_query, '.env')

# Kondisional print untuk debugging awal, bisa diaktifkan jika perlu
# print(f"[query.py] Path skrip: {script_path_query}")
# print(f"[query.py] Project root: {project_root_query}")
# print(f"[query.py] Mencoba memuat .env dari: {dotenv_path_query}")
if os.path.exists(dotenv_path_query):
    load_dotenv(dotenv_path_query)
    # print("[query.py] .env dimuat.")
# else:
    # print(f"[query.py] .env TIDAK ditemukan di {dotenv_path_query}.")

# --- Konfigurasi Model Embedding (harus sama dengan yang digunakan di embed.py) ---
embedding_model_name_query = "sentence-transformers/all-MiniLM-L6-v2"
model_kwargs_embed_query = {'device': 'cpu'}
encode_kwargs_embed_query = {'normalize_embeddings': True}

embeddings_query = HuggingFaceEmbeddings(
    model_name=embedding_model_name_query,
    model_kwargs=model_kwargs_embed_query,
    encode_kwargs=encode_kwargs_embed_query
)

# --- Memuat Vector Store ---
script_dir_query = os.path.dirname(script_path_query)
vectorstore_name_query = "vectorstore_faiss_hf"
vectorstore_path_query = os.path.join(script_dir_query, vectorstore_name_query)

if not os.path.exists(vectorstore_path_query):
    print(f"ERROR_VECTORSTORE_NOT_FOUND: Vector store tidak ditemukan di {vectorstore_path_query}. Jalankan embed.py terlebih dahulu.", file=sys.stderr)
    sys.exit(1) 

try:
    vectorstore_query = FAISS.load_local(vectorstore_path_query, embeddings_query, allow_dangerous_deserialization=True)
    retriever_query = vectorstore_query.as_retriever()
except Exception as e_vs:
    print(f"ERROR_LOADING_VECTORSTORE: Gagal memuat vector store - {str(e_vs)}", file=sys.stderr)
    traceback.print_exc(file=sys.stderr)
    sys.exit(1)

# --- Menginisialisasi LLM Lokal (GPT-2) ---
llm_query = None
try:
    llm_model_name_query = "gpt2"

    tokenizer_query = AutoTokenizer.from_pretrained(llm_model_name_query)
    model_query = AutoModelForCausalLM.from_pretrained(
        llm_model_name_query,
        device_map="auto"
    )
    
    pipe_query = pipeline(
        "text-generation",
        model=model_query,
        tokenizer=tokenizer_query,
        max_new_tokens=150,
        do_sample=True,
        temperature=0.7,
        top_k=50,
        top_p=0.95,
        repetition_penalty=1.1
    )
    
    llm_query = HuggingFacePipeline(pipeline=pipe_query)

except Exception as e_llm:
    print(f"ERROR_INITIALIZING_LLM: Gagal menginisialisasi LLM lokal - {str(e_llm)}", file=sys.stderr)
    traceback.print_exc(file=sys.stderr)

# --- Membuat Custom Prompt Template ---
prompt_template_str = """Gunakan potongan konteks berikut untuk menjawab pertanyaan di akhir.
Jika Anda tidak tahu jawabannya berdasarkan konteks yang diberikan, katakan dengan jujur bahwa Anda tidak tahu. Jangan mencoba mengarang jawaban.
Usahakan jawaban ringkas dan relevan dengan pertanyaan.

Konteks:
{context}

Pertanyaan: {question}

Jawaban yang Membantu:"""
CUSTOM_PROMPT = PromptTemplate(
    template=prompt_template_str, input_variables=["context", "question"]
)

# --- Membuat RAG Chain ---
qa_chain = None
if llm_query and retriever_query:
    try:
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm_query,
            retriever=retriever_query,
            chain_type_kwargs={"prompt": CUSTOM_PROMPT},
            return_source_documents=True # Ubah ke True untuk melihat source documents
        )
    except Exception as e_chain:
        print(f"ERROR_CREATING_CHAIN: Gagal membuat RAG chain - {str(e_chain)}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
else:
    if not llm_query:
        print("WARNING_LLM_NOT_INITIALIZED: LLM tidak terinisialisasi, RAG chain tidak bisa dibuat.", file=sys.stderr)

def ask_rag_question(question_text):
    if not qa_chain:
        return "ERROR_RAG_SYSTEM_NOT_READY: Sistem RAG tidak siap karena komponen gagal diinisialisasi."
    
    try:
        result = qa_chain.invoke({"query": question_text}) 
        raw_answer = result.get("result", "Tidak ada jawaban mentah yang dihasilkan oleh model.")
        source_documents = result.get("source_documents") # Ambil source documents jika return_source_documents=True

        # --- CETAK OUTPUT MENTAH DAN SUMBER DOKUMEN UNTUK DEBUGGING ---
        print(f"\n--- DOKUMEN SUMBER YANG DIAMBIL (JIKA ADA) ---", file=sys.stderr)
        if source_documents:
            for i, doc in enumerate(source_documents):
                print(f"Dokumen {i+1}:\n{doc.page_content}\nMetada: {doc.metadata}\n--------------------", file=sys.stderr)
        else:
            print("Tidak ada dokumen sumber yang dikembalikan oleh chain.", file=sys.stderr)
        
        print(f"\n--- OUTPUT MENTAH DARI GPT-2 ---", file=sys.stderr) # Cetak ke stderr agar tidak mengganggu stdout utama
        print(raw_answer, file=sys.stderr)
        print(f"----------------------------------\n", file=sys.stderr)
        # --- AKHIR BAGIAN DEBUGGING ---

        # Untuk sekarang, kita kembalikan jawaban mentah agar bisa dianalisis
        # Logika post-processing bisa ditambahkan kembali di sini setelah analisis output mentah
        cleaned_answer = raw_answer 

        # Contoh post-processing yang sangat sederhana (bisa diaktifkan kembali dan disesuaikan):
        # if cleaned_answer.lower().startswith(question_text.lower()):
        #     cleaned_answer = cleaned_answer[len(question_text):].strip()
        #     if cleaned_answer.startswith(":") or cleaned_answer.startswith(","):
        #         cleaned_answer = cleaned_answer[1:].strip()
        
        # if "gunakan potongan konteks berikut" in cleaned_answer.lower() or \
        #    cleaned_answer.lower().strip() == "jawaban yang membantu:":
        #     cleaned_answer = "Model tidak dapat memberikan jawaban yang sesuai berdasarkan konteks (setelah post-processing)."

        return cleaned_answer if cleaned_answer else "Model tidak memberikan output mentah."
            
    except Exception as e_ask:
        print(f"ERROR_PROCESSING_QUESTION: Gagal memproses pertanyaan '{question_text}' - {str(e_ask)}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        return "Terjadi kesalahan internal saat memproses pertanyaan Anda."

if __name__ == "__main__":
    if len(sys.argv) > 1:
        input_question = sys.argv[1]
        final_answer = ask_rag_question(input_question)
        print(final_answer) # Ini adalah output utama yang akan diambil Next.js
    else:
        # Mode interaktif (output ke stderr agar tidak mengganggu jika ada panggilan lain)
        print("[query.py] Masuk mode interaktif. Berikan pertanyaan sebagai argumen untuk output bersih.", file=sys.stderr)
        print("Ketik 'exit' untuk keluar.", file=sys.stderr)
        while True:
            user_q = input("Pertanyaan Anda (stderr): ")
            if user_q.lower() == 'exit':
                break
            ans = ask_rag_question(user_q)
            print(f"Jawaban (stderr): {ans}\n", file=sys.stderr)