import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Divider,
} from "@mui/material";

const ValidarPage = () => {
  const [propostas, setPropostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfSelecionado, setPdfSelecionado] = useState(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [motivoRejeicao, setMotivoRejeicao] = useState("");
  const [propostaRejeitada, setPropostaRejeitada] = useState(null);

  // simulação de dados mockados


  const handleDownload = (pdfUrl, nomeCliente) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `Proposta-${nomeCliente}.pdf`;
    link.click();
  };

  const handleFinalizar = (id) => {
    setPropostas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "finalizada" } : p))
    );
  };

  const handleRejeitar = () => {
    setPropostas((prev) =>
      prev.map((p) =>
        p.id === propostaRejeitada
          ? { ...p, status: "rejeitada", motivoRejeicao }
          : p
      )
    );
    setDialogAberto(false);
    setMotivoRejeicao("");
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "30px", maxWidth: "1000px", margin: "auto" }}>
      <Typography variant="h4" color="gray" mb={4} gutterBottom>
        Validação de Propostas
      </Typography>

      {propostas.length === 0 ? (
        <Typography textAlign="center" mt={5}>
          Nenhuma proposta gerada até o momento.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {propostas.map((prop) => (
            <Box
              key={prop.id}
              sx={{
                backgroundColor: "#fff",
                p: 3,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <Typography variant="h6" gutterBottom>
                {prop.clientName}
              </Typography>
              <Typography>
                <strong>Empresa:</strong> {prop.company}
              </Typography>
              <Typography>
                <strong>Email:</strong> {prop.email}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      prop.status === "finalizada"
                        ? "green"
                        : prop.status === "rejeitada"
                        ? "red"
                        : "orange",
                    fontWeight: "bold",
                  }}
                >
                  {prop.status || "pendente"}
                </span>
              </Typography>

              {prop.motivoRejeicao && (
                <Typography sx={{ mt: 1, color: "red" }}>
                  <strong>Motivo da Rejeição:</strong> {prop.motivoRejeicao}
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              {prop.pdfUrl && (
                <Box>
                  {pdfSelecionado === prop.id && (
                    <iframe
                      src={prop.pdfUrl}
                      title="Visualização da proposta"
                      width="100%"
                      height="300px"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    ></iframe>
                  )}

                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        setPdfSelecionado(
                          pdfSelecionado === prop.id ? null : prop.id
                        )
                      }
                    >
                      {pdfSelecionado === prop.id
                        ? "Fechar Visualização"
                        : "Visualizar PDF"}
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handleDownload(prop.pdfUrl, prop.clientName)
                      }
                    >
                      Baixar
                    </Button>

                    {prop.status === "pendente" && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleFinalizar(prop.id)}
                        >
                          Finalizar
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => {
                            setPropostaRejeitada(prop.id);
                            setDialogAberto(true);
                          }}
                        >
                          Rejeitar
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Dialog de rejeição */}
      <Dialog open={dialogAberto} onClose={() => setDialogAberto(false)}>
        <DialogTitle>Motivo da Rejeição</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Explique o motivo"
            value={motivoRejeicao}
            onChange={(e) => setMotivoRejeicao(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogAberto(false)}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            disabled={!motivoRejeicao.trim()}
            onClick={handleRejeitar}
          >
            Enviar Rejeição
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ValidarPage;
