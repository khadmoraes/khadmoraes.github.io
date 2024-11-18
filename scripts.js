import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBlfZuRvV_mn4VJUl1tbjiTxmycGh0HDu4",
    authDomain: "luziaraparty.firebaseapp.com",
    projectId: "luziaraparty",
    storageBucket: "luziaraparty.appspot.com",
    messagingSenderId: "296646170938",
    appId: "1:296646170938:web:0fe37bb0c5cf829ce89803",
    measurementId: "G-EYJWKYV2VE"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Função para fazer upload de uma foto ou vídeo
async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert("Selecione um arquivo primeiro.");
        return;
    }

    try {
        const storageRef = ref(storage, 'uploads/' + file.name);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Adiciona o URL ao Firestore
        await addDoc(collection(db, 'uploads'), {
            url: downloadURL,
            timestamp: serverTimestamp(),
            type: file.type.includes('image') ? 'image' : 'video'
        });

        alert('Upload feito com sucesso!');
        location.reload(); // Atualiza a página após o upload
    } catch (error) {
        console.error("Erro no upload:", error);
        alert("Falha no upload. Tente novamente.");
    }
}

// Adicionar evento ao botão para chamar uploadFile
document.getElementById('uploadButton').addEventListener('click', uploadFile);

// Função para carregar e exibir as fotos e vídeos do Firebase
function showUploads() {
    const uploadsDiv = document.getElementById('uploads');

    onSnapshot(collection(db, 'uploads'), (snapshot) => {
        uploadsDiv.innerHTML = '';

        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.type === 'image') {
                const img = document.createElement('img');
                img.src = data.url;
                uploadsDiv.appendChild(img);
            } else if (data.type === 'video') {
                const video = document.createElement('video');
                video.src = data.url;
                video.controls = true;
                uploadsDiv.appendChild(video);
            }
        });
    });
}

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', showUploads);
