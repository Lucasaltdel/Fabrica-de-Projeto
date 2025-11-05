import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/leads/${id}`)
      .then((response) => {
        setLead(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar o lead:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!lead) {
    return <Typography align="center">Lead não encontrado.</Typography>;
  }

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        p: 5,
        borderRadius: "12px",
        boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
        maxWidth: 650,
        margin: "40px auto",
        fontFamily: "Montserrat, sans-serif",
        color: "#333",
      }}
    >
      <Button
        variant="outlined"
        onClick={() => navigate(-1)}
        sx={{
          mb: 3,
          borderColor: "#673ab7",
          color: "#673ab7",
          "&:hover": { backgroundColor: "#f3e5f5" },
        }}
      >
        Voltar
      </Button>

      {/* Nome principal */}
      <Typography
        variant="h4"
        sx={{ color: "#512da8", fontWeight: 600, mb: 1 }}
      >
        {lead.clientName}
      </Typography>

      {/* Barrinha amarela */}
      <Box
        sx={{ width: "40px", height: "3px", backgroundColor: "#ffb300", mb: 3 }}
      />

      {/* Empresa */}
      <Typography variant="h6" sx={{ color: "#512da8" }}>
        Empresa: {lead.company}
      </Typography>

      {/* Mensagem principal (proposta) */}
      {lead.message && (
        <Typography sx={{ mt: 1 }}>
          <strong>Proposta:</strong> {lead.message}
        </Typography>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Contato */}
      <Typography variant="h6" sx={{ color: "#512da8" }}>
        Contato:
      </Typography>

      {lead.phone && (
        <Typography sx={{ mt: 1 }}>
          <strong>Telefone:</strong> {lead.phone}
        </Typography>
      )}

      {lead.email && (
        <Typography sx={{ mt: 1 }}>
          <strong>Email:</strong> {lead.email}
        </Typography>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Se houver uma mensagem adicional */}
      <Typography variant="h6" sx={{ color: "#512da8" }}>
        Solicitação:
      </Typography>
      <Typography sx={{ mt: 1 }}>{lead.servico || "—"}</Typography>

      <Divider sx={{ my: 3 }} />

      {/* Data de recebimento, se existir */}
      <Typography
        variant="body2"
        sx={{ mt: 4, color: "#757575", fontSize: "0.9rem" }}
      >
        <strong>Recebido:</strong> {lead.data || "—"}
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate(`/proposta`, { state: { leadId: lead.id } })}
        sx={{
          mb: 1,
          backgroundColor: "#673ab7",
          color: "#fff",
          "&:hover": { backgroundColor: "#5e35b1" },
          float: "right",
        }}
      >
        Gerar Proposta
      </Button>
    </Box>
  );
};

export default LeadDetails;
