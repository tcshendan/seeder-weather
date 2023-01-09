import axios from "axios";

/**
 * 网络请求配置
 */
// export const baseUrl = 'http://liu.fgimax.vipnps.vip';
// axios的实例及拦截器配置
const axiosInstance = axios.create({
  // baseURL: baseUrl
});

/**
 * http request 拦截器
 */
axiosInstance.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

/**
 * http response 拦截器
 */
axiosInstance.interceptors.response.use(
  res => res.data,
  err => {
    console.log(err, "网络错误");
  }
);

export default axiosInstance;