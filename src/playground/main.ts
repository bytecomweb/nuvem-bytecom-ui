import { createApp } from 'vue';
import '@/style.css';
import NuvemBytecomUi from '@/index';
import App from './App.vue';
import 'primeicons/primeicons.css';

createApp(App)
  .use(NuvemBytecomUi, {
    api: {
      baseURL: 'http://localhost:3000/api/v1',
    },
  })
  .mount('#app');
