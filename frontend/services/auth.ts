// This file contains the authentication services for the Municipal Attendance System frontend application.
import api from "./api";
import {
  LoginRequest,
  LoginResponse
} from "../types/auth";

export const adminLogin = async (
  data: LoginRequest
): Promise<LoginResponse> => {

  const response = await api.post(
    "/auth/admin/login",
    data
  );

  return response.data;
};

export const employeeLogin = async (
  data: LoginRequest
): Promise<LoginResponse> => {

  const response = await api.post(
    "/auth/employee/login",
    data
  );

  return response.data;
};