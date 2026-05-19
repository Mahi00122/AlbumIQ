import api from "./api";


export async function searchPhotos({ eventCode, selfie }) {
  const formData = new FormData();
  formData.append("event_code", eventCode);
  formData.append("selfie", selfie);

  const { data } = await api.post("/search/", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return data;
}

