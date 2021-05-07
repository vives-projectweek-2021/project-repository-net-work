import { createApp } from 'vue'
import App from './App.vue'
import KProgress from 'k-progress-v3';


createApp(App).component('k-progress', KProgress).mount('#app')
