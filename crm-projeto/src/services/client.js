export default getClient()
{
    return await api.get("/Clients")
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Erro ao buscar os dados:", error);
        return [];
      });;
}