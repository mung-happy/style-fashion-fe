import { https } from "../config/axios";

const categoryService = {
  getAllCategories() {
    return https.get(`/categories`);
  },
  getCategoryByPage(limit: number, page: number) {
    return https.get(`/categories?limit=${limit}&page=${page}`);
  }
};

export default categoryService;
