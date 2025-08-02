import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { getConfig, getOrCreateConfig, type DifyConfig } from '../config';

/**
 * Create an Axios instance with default configuration for Dify API
 * @param config The Dify configuration
 * @returns Configured Axios instance
 */
export function createClient(config: DifyConfig): AxiosInstance {
  const client = axios.create({
    baseURL: config.apiBaseUrl,
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor for logging
  client.interceptors.request.use(
    (request) => {
      console.log(`[Dify Client] Sending ${request.method?.toUpperCase()} request to ${request.url}`);
      return request;
    },
    (error) => {
      console.error('[Dify Client] Request error:', error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for logging and error handling
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`[Dify Client] Received ${response.status} response from ${response.config.url}`);
      return response;
    },
    (error: AxiosError) => {
      console.error('[Dify Client] Response error:', error.response?.status, error.response?.data);
      return Promise.reject(error);
    }
  );

  return client;
}

/**
 * Get a configured Axios instance for Dify API
 * @param config Optional configuration object
 * @returns Configured Axios instance
 */
export function getClient(config?: Partial<DifyConfig>): AxiosInstance {
  const difyConfig = getOrCreateConfig(config);
  return createClient(difyConfig);
}