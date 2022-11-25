import axios from "axios";
import { IPostClient } from "../types";

const API_URL = process.env.REACT_APP_API_URL;

export const getGitAuth = async (token: string) => {
  const userInfo = await axios.post(`${API_URL}/gitAuth`, {
    access_token: token,
  });
  return userInfo;
};

export const getAllPosts = async () => {
  const { data } = await axios.get(`${API_URL}/posts`);
  return data.result;
};

export const getUserPosts = async (id: string, token: string) => {
  const res = await axios.get(`${API_URL}/posts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.result;
};

export const addNewPost = async (data: any, token: string) => {
  const res = await axios.post(`${API_URL}/post`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

export const deletePost = async (id: string, token: string) => {
  const res = await axios.delete(`${API_URL}/post/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const editPost = async (data: IPostClient, token: string) => {
  const res = await axios.put(`${API_URL}/post`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};
