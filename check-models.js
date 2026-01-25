const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' }); 

async function listModels() {
  // CORREÇÃO: Nome da variável atualizado
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!key) {
    console.error("❌ ERRO: A variável GOOGLE_GENERATIVE_AI_API_KEY não foi encontrada.");
    return;
  }

  const genAI = new GoogleGenerativeAI(key);
  
  try {
    // Teste simples para ver se conecta
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent("Hello check");
    console.log("✅ Conexão bem sucedida! Resposta do Gemini:", result.response.text());
    
  } catch (error) {
    console.error("❌ Erro:", error.message);
  }
}

listModels();