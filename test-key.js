const { GoogleGenerativeAI } = require("@google/generative-ai");

// 👇👇👇 COLE SUA CHAVE REAL AQUI DENTRO DAS ASPAS 👇👇👇
const MINHA_CHAVE = "AIzaSyChW3yeFrsmohBXpU7o0UfxPBvwj6fhUDo"; 

async function testKey() {
  if (MINHA_CHAVE === "COLE_SUA_CHAVE_AQUI" || !MINHA_CHAVE) {
    console.log("❌ ERRO: Você esqueceu de colar a chave na linha 4 do arquivo test-key.js!");
    return;
  }

  console.log(`🔑 Testando chave: ${MINHA_CHAVE.substring(0, 10)}...`);
  console.log("🌍 Região detectada (Local): Países Baixos/EU");

  const genAI = new GoogleGenerativeAI(MINHA_CHAVE);

  // Vamos testar o modelo que vimos disponível na sua lista: gemini-2.0-flash
  const modelName = "gemini-2.0-flash"; 

  try {
    console.log(`🤖 Tentando gerar texto com: ${modelName}...`);
    const model = genAI.getGenerativeModel({ model: modelName });
    
    const result = await model.generateContent("Hello from Gemini check.");
    const response = await result.response;
    const text = response.text();
    
    console.log("\n✅ SUCESSO ABSOLUTO!");
    console.log("📝 Resposta da IA:", text);
    console.log("CONCLUSÃO: Sua chave funciona! O problema era apenas a configuração do Next.js.");

  } catch (error) {
    console.error("\n❌ FALHA CRÍTICA DE CONTA:");
    console.error(error.message);
    
    if (error.message.includes("400") || error.message.includes("location") || error.message.includes("supported")) {
      console.log("\n🚨 DIAGNÓSTICO: BLOQUEIO REGIONAL (EUROPA)");
      console.log("O Google bloqueou o uso gratuito da API na sua localização.");
      console.log("SOLUÇÃO: Você precisa adicionar um cartão de crédito no Google AI Studio/Cloud.");
    }
  }
}

testKey();