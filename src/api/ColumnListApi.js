import apiService from "../services/ApiService.js";

import { CARD, COLUMNS, COLUMN } from "@/api/ApiRoutes";

export const ColumnList = async () => {
  const response = await apiService.get(COLUMNS);
  return response.data;
};

export const AddCard = async (data) => {
  return apiService.post(CARD, data);
};

export const AddColumn = async (data) => {
  return apiService.post(COLUMNS, data);
};

export const DeleteColumn = (id) => {
  return apiService.delete(`${COLUMNS}/${id}`);
};

export const EditCard = async (id, data) => {
  return apiService.put(`${CARD}/${id}`, data);
};

export const CardColumnChange = async (cardId, columnId) => {
  return apiService.post(`${CARD}/${cardId}/${COLUMN}/${columnId}`);
};
