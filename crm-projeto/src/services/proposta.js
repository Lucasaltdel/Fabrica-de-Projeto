export default getProposta();

{
    return await api.get("/Propostas")
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Erro ao buscar os dados:", error);
        return [];
      });

}



