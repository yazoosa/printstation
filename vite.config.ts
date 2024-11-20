import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    define: {
      'import.meta.env.MAILGUN_SMTP_HOST': JSON.stringify(env.MAILGUN_SMTP_HOST),
      'import.meta.env.MAILGUN_SMTP_PORT': JSON.stringify(env.MAILGUN_SMTP_PORT),
      'import.meta.env.MAILGUN_SMTP_USER': JSON.stringify(env.MAILGUN_SMTP_USER),
      'import.meta.env.MAILGUN_SMTP_PASS': JSON.stringify(env.MAILGUN_SMTP_PASS),
      'import.meta.env.MAILGUN_API_KEY': JSON.stringify(env.MAILGUN_API_KEY),
      'import.meta.env.VITE_WC_API_URL': JSON.stringify(env.VITE_WC_API_URL),
      'import.meta.env.VITE_WC_CONSUMER_KEY': JSON.stringify(env.VITE_WC_CONSUMER_KEY),
      'import.meta.env.VITE_WC_CONSUMER_SECRET': JSON.stringify(env.VITE_WC_CONSUMER_SECRET),
      'import.meta.env.VITE_WC_PRINT_PRODUCT_ID': JSON.stringify(env.VITE_WC_PRINT_PRODUCT_ID),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
    },
  };
});