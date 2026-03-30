import { createApp } from 'vue';
import '@/style.css';
import NuvemBytecomUi from '@/index';
import App from './App.vue';
import 'primeicons/primeicons.css';
import '../style.css';

const app = createApp(App);

app.use(NuvemBytecomUi, {
  api: {
    baseURL: 'http://localhost:3000/api/v1',
  },
});

app.mount('#app');
