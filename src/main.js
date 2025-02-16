import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import './main.scss';

const app = createApp(App);
app.mount('#app');
