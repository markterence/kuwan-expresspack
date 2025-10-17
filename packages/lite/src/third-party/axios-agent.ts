import type { AddressInfo } from 'node:net';
import axios from 'axios'; 

export async function createAxiosAgent(server: any) {
  const addressInfo = server.address() as AddressInfo;
  const request = axios.create({
    adapter: 'fetch',
  });
  if (typeof addressInfo !== 'string' && addressInfo !== null) {
    const { port } = addressInfo;
    request.defaults.baseURL = `http://127.0.0.1:${port}`;
  }
  return { 
    request,
  };
}
 