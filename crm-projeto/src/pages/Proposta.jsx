import React, { useState, useEffect } from "react";
import api from "../services/api";
import aiApi from "../services/aiApi";
import { jsPDF } from "jspdf";
import { useLocation } from "react-router-dom";

const PropostaPage = () => {
  const [leadId, setLeadId] = useState("");
  const [promptExtra, setPromptExtra] = useState("");
  const [slides, setSlides] = useState("");
  const [leadsList, setLeadsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [validado, setValidado] = useState(false);
  const [leadData, setLeadData] = useState(null);

  const location = useLocation();

  useEffect(() => {
    if (location && location.state && location.state.leadId) {
      setLeadId(String(location.state.leadId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Busca lista de leads para seleção
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await api.get('/api/Clientes'); // <-- MUDANÇA: Usar a API real de Clientes
        setLeadsList(res.data || []);
      } catch (e) {
        console.warn('Não foi possível buscar lista de leads', e);
      }
    };
    fetchLeads();
  }, []);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const gerarSlides = async () => {
    setLoading(true);
    setErro("");
    setSlides("");
    setPdfUrl(null);
    setValidado(false);

    try {
      // 1️⃣ Busca o lead completo (usa cliente centralizado)
      const leadResponse = await api.get(`/api/Clientes/${leadId}`); // <-- MUDANÇA: Usar a API real de Clientes
      const lead = leadResponse.data;
      setLeadData(lead);

      // 2️⃣ Envia o lead + prompt extra para o backend
      const iaResponse = await aiApi.post(`/gerar-proposta`, {
        ...lead,
        promptExtra: promptExtra.trim(),
      });

      // 3️⃣ Salva os slides e gera PDF localmente
      const generatedSlides = iaResponse.data.slides;
      setSlides(generatedSlides);
      // Se backend retornar pdfUrl, usa; caso contrário gera localmente
      if (iaResponse.data.pdfUrl) {
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        setPdfUrl(iaResponse.data.pdfUrl);
      } else {
        const url = await gerarPdfLocal(lead, generatedSlides);
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        setPdfUrl(url);
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

  // Função refatorada para garantir que o cliente exista no backend antes de criar a proposta.
  const mandarParaValidacao = async () => {
    if (!leadId || !leadData) return alert('Selecione um lead e gere a proposta antes de enviar.');
    if (!slides && !pdfUrl) return alert('Gere a proposta antes de enviar para validação.');

    try {
      // Lógica simplificada: Como o leadId já é de um cliente real do banco de dados,
      // não precisamos mais criar ou buscar o cliente. O ID já é o correto.
      const clienteId = leadId;

      const propostaPayload = { 
        slides, 
        pdfUrl, 
        statusValidacao: "Aguardando Validação" 
      };

      // Criar a proposta usando o ID do cliente REAL do backend.
      const responseProposta = await api.post(`/api/propostas-cliente/${clienteId}/criar`, propostaPayload);
      
      alert('Proposta enviada para validação com sucesso! Ela aparecerá na página de Validar.');

    } catch (e) {
      console.error('Erro completo ao enviar proposta para validação:', e);
      const errorMessage = e?.response?.data?.message || e?.response?.data?.detail || e?.message || 'Erro desconhecido';
      alert(`Falha ao enviar proposta para validação: ${errorMessage}`);
    }
  };


  const toDataURL = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const gerarPdfLocal = async (lead, slidesText) => {
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const margin = 15;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const maxWidth = pageWidth - margin * 2;
      let y = 20;

      // Tenta carregar logo opcional em /logo.png ou /assets/logo.png
      let logoDataUrl = null;
      try {
        const logoPaths = ["/logo.png", "/assets/logo.png", "/public/logo.png"];
        for (const p of logoPaths) {
          try {
            const res = await fetch(p);
            if (!res.ok) continue;
            
            // Verifica se é uma imagem válida
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.startsWith('image/')) {
              continue;
            }
            
            const blob = await res.blob();
            
            // Verifica se o blob não está vazio e tem tamanho mínimo de PNG
            if (blob.size < 8) {
              continue;
            }
            
            // Verifica se é PNG válido lendo os primeiros bytes
            const arrayBuffer = await blob.slice(0, 8).arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);
            const pngSignature = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
            const isPng = bytes.every((byte, index) => byte === pngSignature[index]);
            
            if (isPng) {
              logoDataUrl = await toDataURL(blob);
              break;
            }
          } catch (err) {
            // Ignora erros de carregamento de logo (não é crítico)
            console.debug('Não foi possível carregar logo do caminho:', p, err);
            continue;
          }
        }
      } catch (err) {
        // Logo é opcional, não deve quebrar o fluxo
        console.debug('Erro ao tentar carregar logo:', err);
        logoDataUrl = null;
      }

      // Header com estilo
      if (logoDataUrl) {
        try {
          doc.addImage(logoDataUrl, 'PNG', margin, 8, 30, 30);
        } catch (e) {
          // falha ao adicionar logo não crítica - continua sem logo
          console.debug('Não foi possível adicionar logo no PDF (continuando sem logo)', e);
        }
      }

      doc.setFontSize(18);
      doc.setTextColor('#1f2937');
      const titleX = logoDataUrl ? margin + 36 : margin;
      doc.text(`Proposta Comercial`, titleX, 20);
      doc.setFontSize(11);
      doc.setTextColor('#374151');
      doc.text(`Cliente: ${lead?.nome || '-'}`, titleX, 26);
      doc.text(`Empresa: ${lead?.nome || '-'}`, titleX, 32); // Usando nome como empresa, ajuste se houver campo específico
      y = 42;

      // Linha separadora
      doc.setDrawColor(200);
      doc.setLineWidth(0.5);
      doc.line(margin, y - 6, pageWidth - margin, y - 6); // Ajuste de y

      // Informação adicional
      doc.setFontSize(10);
      doc.text(`Contato: ${lead?.email || '-'}`, margin, y); // Removido telefone que não existe no modelo Cliente
      y += 8;
      if (lead?.data) {
        doc.text(`Data: ${lead.data}`, margin, y);
        y += 8;
      }

      // Quebra em seções: divide slidesText por quebras de linha duplas para tópicos
      const sections = slidesText.split('\n\n').map(s => s.trim()).filter(Boolean);
      doc.setFontSize(12);

      for (const section of sections) {
        const header = section.split('\n')[0];
        const body = section.split('\n').slice(1).join('\n') || '';

        // título da seção
        doc.setFontSize(13);
        doc.setTextColor('#0f172a');
        const headerLines = doc.splitTextToSize(header, maxWidth);
        for (const hl of headerLines) {
          if (y + 8 > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(hl, margin, y);
          y += 7;
        }

        // corpo
        doc.setFontSize(11);
        doc.setTextColor('#374151');
        const bodyLines = doc.splitTextToSize(body || header, maxWidth);
        for (const bl of bodyLines) {
          if (y + 7 > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(bl, margin, y);
          y += 6.5;
        }

        y += 4; // espaço entre seções
      }

      // Rodapé
      const footerText = 'Proposta gerada automaticamente - revisar valores e condições.';
      doc.setFontSize(9);
      doc.setTextColor('#6b7280');
      doc.text(footerText, margin, pageHeight - 10);

      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      return url;
    } catch (e) {
      console.error('Erro ao gerar PDF local:', e);
      return null;
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: 6 }}>Selecionar Lead</label>
            <select
              value={leadId}
              onChange={async (e) => {
                const id = e.target.value;
                setLeadId(id);
                if (id) {
                  try {
                    const res = await api.get(`/api/Clientes/${id}`); // <-- MUDANÇA: Usar a API real de Clientes
                    setLeadData(res.data);
                  } catch (err) {
                    console.warn('Erro ao buscar lead selecionado', err);
                  }
                } else {
                  setLeadData(null);
                }
              }}
              style={{ padding: 8, borderRadius: 6 }}
            >
              <option value="">-- selecione --</option>
              {leadsList.map((l) => (
                <option key={l.id} value={l.id}>{`${l.id} - ${l.nome}`}</option> 
              ))}
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ marginBottom: 6 }}>Prompt (opcional)</label>
            <input
              value={promptExtra}
              onChange={(e) => setPromptExtra(e.target.value)}
              placeholder="Adicione instruções adicionais para a IA"
              style={{ width: '100%', padding: 8, borderRadius: 6 }}
            />
          </div>

          <button
            onClick={gerarSlides}
            disabled={!leadId || loading}
            style={{
              padding: "12px 18px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "6px",
              fontWeight: "bold",
              fontSize: "14px",
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
                  onClick={mandarParaValidacao}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#6f42c1",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Mandar para Validação
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

                <button
                  onClick={() => {
                    // Baixa PDF gerado localmente
                    try {
                      if (leadData && slides) {
                        const doc = new jsPDF({ unit: "mm", format: "a4" });
                        const margin = 15;
                        const pageWidth = doc.internal.pageSize.getWidth();
                        const maxWidth = pageWidth - margin * 2;
                        let y = 20;

                        doc.setFontSize(16);
                        doc.text(`Proposta - ${leadData.clientName || "Cliente"}`, margin, y);
                        y += 8;
                        doc.setFontSize(11);
                        doc.text(`Empresa: ${leadData.company || "-"}`, margin, y);
                        y += 6;
                        doc.text(`Contato: ${leadData.email || "-"} | ${leadData.phone || "-"}`, margin, y);
                        y += 8;
                        doc.setLineWidth(0.5);
                        doc.line(margin, y, pageWidth - margin, y);
                        y += 8;

                        const lines = doc.splitTextToSize(slides, maxWidth);
                        const lineHeight = 7;
                        for (let i = 0; i < lines.length; i++) {
                          if (y + lineHeight > doc.internal.pageSize.getHeight() - margin) {
                            doc.addPage();
                            y = margin;
                          }
                          doc.text(lines[i], margin, y);
                          y += lineHeight;
                        }

                        doc.save(`proposta_${leadData.clientName || leadId}.pdf`);
                      } else if (pdfUrl) {
                        // Se for URL remoto, faz download via fetch
                        fetch(pdfUrl)
                          .then((r) => r.blob())
                          .then((blob) => {
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = `proposta_${leadId}.pdf`;
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                          });
                      }
                    } catch (e) {
                      console.error('Erro ao baixar PDF:', e);
                    }
                  }}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#2196f3",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Baixar PDF
                </button>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropostaPage;
