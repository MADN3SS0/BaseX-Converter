const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const encodeType = document.getElementById('encodeType');
const convertBtn = document.getElementById('convertBtn');
const copyBtn = document.getElementById('copyBtn');
const output = document.getElementById('output');
let fileData = null;

// Preview da imagem
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
      preview.style.display = 'block';
      fileData = e.target.result.split(',')[1]; // apenas dados da imagem
    };
    reader.readAsDataURL(file);
  }
});

// Função para converter para Base85
function toBase85(input) {
  const textEncoder = new TextEncoder();
  const bytes = textEncoder.encode(atob(input));
  let result = "";
  for (let i = 0; i < bytes.length; i += 4) {
    let chunk = (bytes[i] << 24) >>> 0;
    if (i + 1 < bytes.length) chunk |= (bytes[i+1] << 16);
    if (i + 2 < bytes.length) chunk |= (bytes[i+2] << 8);
    if (i + 3 < bytes.length) chunk |= (bytes[i+3]);
    let block = "";
    for (let j = 0; j < 5; j++) {
      block = String.fromCharCode((chunk % 85) + 33) + block;
      chunk = Math.floor(chunk / 85);
    }
    result += block;
  }
  return result;
}

// Converter
convertBtn.addEventListener('click', () => {
  if (!fileData) {
    alert(translations[currentLang].alertNoFile);
    return;
  }

  if (encodeType.value === "base64") {
    output.value = fileData;
  } else {
    output.value = toBase85(fileData);
  }
});

// Copiar para área de transferência
copyBtn.addEventListener('click', () => {
  output.select();
  document.execCommand("copy");
  alert(translations[currentLang].alertCopied);
});

// =====================
// Language Selector
// =====================
const languageSelect = document.getElementById('languageSelect');

const translations = {
  pt: {
    chooseFile: "📂 Escolher Imagem",
    convert: "🔄 Converter",
    copy: "📋 Copiar",
    outputPlaceholder: "O resultado aparecerá aqui...",
    alertNoFile: "Selecione uma imagem primeiro!",
    alertCopied: "Copiado para a área de transferência!"
  },
  en: {
    chooseFile: "📂 Choose Image",
    convert: "🔄 Convert",
    copy: "📋 Copy",
    outputPlaceholder: "The result will appear here...",
    alertNoFile: "Please select an image first!",
    alertCopied: "Copied to clipboard!"
  },
  de: {
    chooseFile: "📂 Bild auswählen",
    convert: "🔄 Konvertieren",
    copy: "📋 Kopieren",
    outputPlaceholder: "Das Ergebnis wird hier angezeigt...",
    alertNoFile: "Bitte zuerst ein Bild auswählen!",
    alertCopied: "In die Zwischenablage kopiert!"
  },
  fr: {
    chooseFile: "📂 Choisir l'image",
    convert: "🔄 Convertir",
    copy: "📋 Copier",
    outputPlaceholder: "Le résultat apparaîtra ici...",
    alertNoFile: "Veuillez d'abord sélectionner une image !",
    alertCopied: "Copié dans le presse-papiers !"
  }
};

let currentLang = 'pt';

function updateLanguage(lang) {
  currentLang = lang;
  document.querySelector('.upload-label').textContent = translations[lang].chooseFile;
  document.getElementById('convertBtn').textContent = translations[lang].convert;
  document.getElementById('copyBtn').textContent = translations[lang].copy;
  document.getElementById('output').placeholder = translations[lang].outputPlaceholder;
}

languageSelect.addEventListener('change', (e) => {
  updateLanguage(e.target.value);
});

// Inicializa com Português
updateLanguage('pt');
