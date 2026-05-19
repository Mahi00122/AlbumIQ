import api from "../api/axios";

export function loginAdmin(payload) {
  return api.post("/admin/login", payload);
}

export function getDashboardAnalytics() {
  return api.get("/admin/analytics");
}
