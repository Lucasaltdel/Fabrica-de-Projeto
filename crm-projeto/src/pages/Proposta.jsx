import React, { useState, useEffect } from "react";
import api from "../services/api";
import aiApi from "../services/aiApi";
import { useLocation } from "react-router-dom";

const PropostaPage = () => {
  const [leadId, setLeadId] = useState("");
  const [promptExtra, setPromptExtra] = useState("");
  const [slides, setSlides] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [validado, setValidado] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location && location.state && location.state.leadId) {
      setLeadId(String(location.state.leadId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gerarSlides = async () => {
    setLoading(true);
    setErro("");
    setSlides("");
    setPdfUrl(null);
    setValidado(false);

    try {
      // 1️⃣ Busca o lead completo (usa cliente centralizado)
      const leadResponse = await api.get(`/leads/${leadId}`);
      const lead = leadResponse.data;

      // 2️⃣ Envia o lead + prompt extra para o backend
      const iaResponse = await aiApi.post(`/gerar-proposta`, {
        ...lead,
        promptExtra: promptExtra.trim(),
      });

      // 3️⃣ Salva os slides e o PDF (caso venha)
      setSlides(iaResponse.data.slides);
      if (iaResponse.data.pdfUrl) {
        setPdfUrl(iaResponse.data.pdfUrl);
      }
    } catch (err) {
      console.error("Erro:", err);
      setErro(
        "Falha ao gerar slides. Verifique se o ID existe e o servidor está rodando."
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmarValidacao = () => {
    setValidado(true);
    alert("Proposta validada com sucesso!");
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "850px",
        margin: "auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333" }}>
        Gerar Proposta Automática
      </h1>
      <p style={{ textAlign: "center", color: "#666" }}>
        Informe o ID do lead e adicione instruções extras para personalizar a
        proposta antes de gerar.
      </p>

      {/* Campos principais */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginTop: "25px",
          backgroundColor: "#fafafa",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "6px",
            }}
          >
            ID do Lead
          </label>
          <input
            type="number"
            value={leadId}
            onChange={(e) => setLeadId(e.target.value)}
            placeholder="ex: 3"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Instruções adicionais (Prompt extra)
          </label>
          <textarea
            value={promptExtra}
            onChange={(e) => setPromptExtra(e.target.value)}
            placeholder="Exemplo: use um tom mais profissional e destaque benefícios técnicos."
            rows="4"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "15px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
          />
        </div>

        <button
          onClick={gerarSlides}
          disabled={!leadId || loading}
          style={{
            padding: "12px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "16px",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0069d9")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007BFF")}
        >
          {loading ? "Gerando..." : "Gerar Proposta"}
        </button>
      </div>

      {erro && (
        <p style={{ color: "red", marginTop: "20px", textAlign: "center" }}>
          {erro}
        </p>
      )}

      {/* Resultado */}
      {slides && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "25px",
            marginTop: "40px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Slides Gerados:</h2>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontSize: "16px",
              background: "#f5f5f5",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {slides}
          </pre>

          {pdfUrl && (
            <div style={{ marginTop: "30px" }}>
              <h3>Visualização da Proposta (PDF)</h3>
              <iframe
                src={pdfUrl}
                title="Visualização da proposta"
                width="100%"
                height="500px"
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                }}
              ></iframe>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                  gap: "15px",
                }}
              >
                <button
                  onClick={confirmarValidacao}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Confirmar Validação
                </button>

                <button
                  onClick={gerarSlides}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#ffc107",
                    color: "black",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Gerar Novamente
                </button>
              </div>

              {validado && (
                <p
                  style={{
                    color: "green",
                    textAlign: "center",
                    marginTop: "15px",
                  }}
                >
                  ✅ Proposta validada com sucesso!
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropostaPage;
