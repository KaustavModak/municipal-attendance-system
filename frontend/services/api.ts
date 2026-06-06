// All frontend requests to FastAPI through this file.
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export default api;