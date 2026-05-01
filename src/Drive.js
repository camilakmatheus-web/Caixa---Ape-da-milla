import { gapi } from "gapi-script";

const CLIENT_ID = "70223014260-333rgcrni7vnhqg0s379hf18fgttiji3.apps.googleusercontent.com";
const API_KEY = "AIzaSyBF0ZhLekqHvPfp5KiQf0snLf1lXVN1Arg";

const SCOPES = "https://www.googleapis.com/auth/drive.file";

let fileId = null;

// 🚀 INIT GOOGLE
export const initGoogle = () => {
  return new Promise((resolve, reject) => {
    gapi.load("client:auth2", async () => {
      try {
        await gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
          ]
        });

        resolve();
      } catch (err) {
        console.log("Erro initGoogle:", err);
        reject(err);
      }
    });
  });
};

// 🔑 LOGIN (CORRIGIDO E ESTÁVEL)
export const login = async () => {
  const auth = gapi.auth2.getAuthInstance();

  if (!auth) {
    throw new Error("auth2 não inicializado");
  }

  if (!auth.isSignedIn.get()) {
    await auth.signIn();
  }

  const user = auth.currentUser.get();
  const token = user.getAuthResponse().access_token;

  // força token global correto
  gapi.auth.setToken({ access_token: token });

  return user;
};

// 🔍 BUSCAR ARQUIVO
const findFile = async () => {
  const res = await gapi.client.drive.files.list({
    q: "name='ape-da-milla.json'",
    spaces: "drive",
    fields: "files(id, name)"
  });

  if (res.result.files?.length > 0) {
    fileId = res.result.files[0].id;
  }
};

// 📥 CARREGAR DADOS
export const loadData = async () => {
  await findFile();

  const tokenObj = gapi.auth.getToken();

  if (!fileId || !tokenObj?.access_token) return null;

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: {
        Authorization: "Bearer " + tokenObj.access_token,
      },
    }
  );

  return await res.json();
};

// 💾 SALVAR (VERSÃO FINAL ESTÁVEL)
export const saveData = async (data) => {
  const auth = gapi.auth2.getAuthInstance();

  if (!auth || !auth.currentUser.get().isSignedIn()) {
    console.log("❌ SEM LOGIN");
    return;
  }

  const token = auth.currentUser.get().getAuthResponse().access_token;

  if (!token) {
    console.log("❌ SEM TOKEN");
    return;
  }

  const blob = new Blob(
    [JSON.stringify(data)],
    { type: "application/json" }
  );

  const metadata = {
    name: "ape-da-milla.json",
    mimeType: "application/json",
  };

  const form = new FormData();

  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], {
      type: "application/json"
    })
  );

  form.append("file", blob);

  try {
    const url = fileId
      ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
      : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

    const method = fileId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: "Bearer " + token,
      },
      body: form,
    });

    const text = await res.text();

    if (!res.ok) {
      console.log("❌ ERRO DRIVE:", res.status, text);
      return;
    }

    const json = JSON.parse(text);

    if (!fileId) {
      fileId = json.id;
      console.log("✔ ARQUIVO CRIADO NO DRIVE:", fileId);
    } else {
      console.log("✔ ARQUIVO ATUALIZADO NO DRIVE");
    }

  } catch (err) {
    console.log("❌ FALHA SAVE:", err);
  }
};