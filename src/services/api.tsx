import axios from "axios";

const api = axios.create({
  baseURL: "http://10.0.2.104:3333/",
});

const externalApi = axios.create({
  baseURL: "https://servicodados.ibge.gov.br/api/v1/localidades/estados",
});

export { api, externalApi };

// API chamada api
