import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/v1/calendar",
});

export const calendarApi = {
  getMeetings: (start: string, end: string) =>
    API.get("/", { params: { startDate: start, endDate: end } }).then(r => r.data),

  create: (data: any) => API.post("/", data).then(r => r.data),

  update: (id: string, data: any) =>
    API.put(`/${id}`, data).then(r => r.data),

  delete: (id: string) => API.delete(`/${id}`),
};
