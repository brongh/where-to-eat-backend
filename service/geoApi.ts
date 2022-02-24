import axios from "axios";

const geoRootUrl = "https://developers.onemap.sg/commonapi/search";

export const forwardApi = axios.create({
  baseURL: geoRootUrl,
  timeout: 1000,
  headers: { "X-Custom-Header": "where-to-eat" },
});
