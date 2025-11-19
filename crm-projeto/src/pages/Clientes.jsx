import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import { FaRegUserCircle, FaSearch } from "react-icons/fa";
import { MdPageview } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./Forms.css"; // Mantém o mesmo estilo

const ClientesPage = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Dados fake
  useEffect(() => {
    setIsLoading(true);
    setClientes(fakeClientes);
    setFilteredClientes(fakeClientes);
    setIsLoading(false);
  }, []);

  // Colunas da tabela
  const columns = [
    {
      field: "icon",
      headerName: "",
      width: 60,
      sortable: false,
      renderCell: () => <FaRegUserCircle size={22} color="#555" />,
    },
    {
      field: "clientName",
      headerName: "Nome do Cliente",
      flex: 1,
      minWidth: 200,
    },
    { field: "email", headerName: "E-mail", flex: 1, minWidth: 200 },
    { field: "phone", headerName: "Telefone", flex: 1, minWidth: 150 },
    { field: "company", headerName: "Empresa", flex: 1, minWidth: 180 },
    {
      field: "actions",
      headerName: "Ações",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => navigate(`/cliente/${params.row.id}`)}
          >
            <MdPageview size={22} color="#1976d2" />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => console.log("Pesquisar:", params.row.id)}
          >
            <FaSearch size={18} color="#1976d2" />
          </IconButton>
        </>
      ),
    },
  ];

  // Função de busca
  const handleSearchClick = () => {
    if (!searchText.trim()) {
      setFilteredClientes(clientes);
      return;
    }
    const lowerCaseSearch = searchText.toLowerCase();
    const newFiltered = clientes.filter((c) =>
      c.clientName.toLowerCase().includes(lowerCaseSearch)
    );
    setFilteredClientes(newFiltered);
  };

  return (
    <div className="corpo">
      <div className="search-controls">
        <h1>Clientes Cadastrados:</h1>

        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Pesquisar clientes por nome..."
            className="search-bar"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchClick();
            }}
          />
        </div>
      </div>

      <Box
        sx={{
          height: 500,
          marginTop: 5,
          position: "relative",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
          padding: 2,
        }}
      >
        <DataGrid
          rows={filteredClientes}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              fontWeight: "bold",
              fontSize: "1rem",
            },
          }}
        />
      </Box>
    </div>
  );
};

export default ClientesPage;
