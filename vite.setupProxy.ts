import type { HttpProxy, ProxyOptions } from 'vite';

type ProxyType = Record<string, string | ProxyOptions>;

const proxyConfig = (proxy: HttpProxy.Server): void => {
  proxy.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('proxy error', err);
  });
  proxy.on('proxyReq', (proxyReq, req) => {
    // eslint-disable-next-line no-console
    console.info(
      'Sending Request:',
      req.method,
      req.url,
      ' => TO THE TARGET =>  ',
      proxyReq.method,
      proxyReq.protocol,
      proxyReq.host,
      proxyReq.path,
      JSON.stringify(proxyReq.getHeaders()),
    );
  });
  proxy.on('proxyRes', (proxyRes, req) => {
    // eslint-disable-next-line no-console
    console.info('Received Response from the Target:', proxyRes.statusCode, req.url, JSON.stringify(proxyRes.headers));
  });
};

export const createProxy = (): ProxyType => {
  const proxy: ProxyType = {
    '/api/v1': {
      target: 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
      configure: proxyConfig,
    },
  };

  return proxy;
};
