import axios from 'axios';
import { Platform } from 'react-native';

// El problema parece ser que estamos intentando conectar a 127.0.0.1:3000 
// pero el servidor está en otra IP o la app no puede conectarse a esa dirección

// SOLUCIÓN: Especificar directamente la IP de tu computadora
// Esta es la opción más confiable para dispositivos físicos y emuladores
const API_URL = 'http://192.168.0.103:3000'; // IMPORTANTE: REEMPLAZA ESTO CON TU IP REAL

// Si necesitas cambiar la IP según el entorno, puedes usar esta lógica:
/*
// Para web - localhost normal
const WEB_URL = 'http://localhost:3000';

// Para emulador Android (10.0.2.2 es el alias para localhost de la máquina host)
const ANDROID_EMULATOR_URL = 'http://10.0.2.2:3000'; 

// Para iOS emulador o dispositivo físico, usar IP real
const IOS_URL = 'http://192.168.0.103:3000'; // REEMPLAZA CON TU IP

// Detectar el entorno actual para usar la URL correcta
const getApiUrl = () => {
  // Verificar si estamos en web o nativo
  const isWeb = typeof document !== 'undefined';
  
  if (isWeb) {
    return WEB_URL;
  }
  
  // Detectar iOS o Android
  const isIOS = Platform.OS === 'ios';
  return isIOS ? IOS_URL : ANDROID_EMULATOR_URL;
};

const API_URL = getApiUrl();
*/

// Configuración y creación de instancia axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 segundos
});

// Interceptores para depuración
api.interceptors.request.use(
  config => {
    console.log(`🚀 Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log(`✅ Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  error => {
    if (error.response) {
      // La solicitud fue hecha y el servidor respondió con un código de estado
      // que cae fuera del rango 2xx
      console.error(`❌ Response Error: ${error.response.status}`, error.response.data);
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('❌ No Response Error:', error.request);
    } else {
      // Ocurrió un error al configurar la solicitud
      console.error('❌ Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
