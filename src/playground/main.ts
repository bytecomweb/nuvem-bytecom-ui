import { createApp } from 'vue';
import '@/style.css';
import NuvemBytecomUi from '@/index';
import App from './App.vue';
import 'primeicons/primeicons.css';

createApp(App).use(NuvemBytecomUi).mount('#app');
