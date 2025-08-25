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
      fileData = e.target.result.split(',')[1]; // apenas os dados da imagem
    };
    reader.readAsDataURL(file);
  }
});

// Função para converter para Base85 (Ascii85 simples)
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
    alert("Selecione uma imagem primeiro!");
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
  alert("Copiado para a área de transferência!");
});
