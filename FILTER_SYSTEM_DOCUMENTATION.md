# Sistema de Filtros Avanzado - Documentación

## Descripción General

El sistema de filtros proporciona una funcionalidad completa para filtrar jugadores, equipos, partidos y ligas con múltiples criterios combinables. Incluye persistencia de filtros favoritos y sincronización entre dispositivos.

## Características Principales

### 1. Filtros Múltiples Combinables

El sistema permite combinar múltiples filtros simultáneamente:

- **Liga**: Filtrar por competición específica
- **Temporada**: Filtrar por año/temporada
- **Posición**: Filtrar jugadores por posición (múltiple selección)
- **Nacionalidad**: Filtrar jugadores por país (múltiple selección)
- **País**: Filtrar equipos por país (múltiple selección)
- **Estado**: Filtrar partidos por estado (programado, en vivo, finalizado, etc.)
- **Rango de Edad**: Filtrar jugadores por edad mínima y máxima
- **Rango de Fechas**: Filtrar partidos por rango de fechas

### 2. Persistencia de Filtros

#### Filtros Locales

Los últimos filtros aplicados se guardan automáticamente en el dispositivo usando AsyncStorage:

- Se restauran al reabrir la aplicación
- Específicos por tipo de entidad (jugadores, equipos, partidos)
- No requieren autenticación

#### Filtros Favoritos

Los usuarios pueden guardar configuraciones de filtros con nombre:

- Sincronización con el servidor (requiere autenticación)
- Acceso rápido a combinaciones frecuentes
- Gestión completa (crear, cargar, eliminar)

### 3. Interfaz de Usuario

#### FilterPanel Component

Panel modal con todas las opciones de filtrado:

- Secciones expandibles/colapsables
- Indicadores visuales de filtros activos
- Selección simple y múltiple
- Inputs de rango para valores numéricos
- Botones de aplicar y limpiar

#### FavoriteFilters Component

Gestión de filtros guardados:

- Lista de filtros favoritos
- Vista previa de configuración
- Carga rápida de filtros
- Eliminación con confirmación
- Diálogo para guardar nuevos filtros

## Uso

### Implementación Básica

```jsx
import React from 'react';
import { View } from 'react-native';
import FilterPanel from '../components/FilterPanel';
import useFilters from '../hooks/useFilters';

function MyScreen() {
  const {
    filters,
    filterOptions,
    updateFilters,
    applyCurrentFilters,
    hasActiveFilters,
  } = useFilters(userId, 'player');

  const handleApplyFilters = async (newFilters) => {
    updateFilters(newFilters);
    await applyCurrentFilters(newFilters);
  };

  return (
    <View>
      <FilterPanel
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
        filterOptions={filterOptions}
        initialFilters={filters}
        entityType="player"
      />
    </View>
  );
}
```

### Hook useFilters

El hook `useFilters` proporciona toda la funcionalidad necesaria:

```javascript
const {
  // Estado
  filters, // Filtros actuales
  filterOptions, // Opciones disponibles
  favoriteFilters, // Filtros guardados
  results, // Resultados filtrados
  loading, // Estado de carga
  error, // Errores

  // Acciones
  updateFilters, // Actualizar filtros
  clearFilters, // Limpiar todos los filtros
  addFilter, // Agregar un filtro
  removeFilter, // Remover un filtro
  applyCurrentFilters, // Aplicar filtros y obtener resultados

  // Favoritos
  saveAsFavorite, // Guardar como favorito
  deleteFavorite, // Eliminar favorito
  loadFavorite, // Cargar favorito

  // Utilidades
  getActiveFiltersCount, // Contar filtros activos
  hasActiveFilters, // Verificar si hay filtros
  getFiltersSummary, // Obtener resumen
} = useFilters(userId, entityType);
```

### Parámetros

- **userId**: ID del usuario (opcional, para sincronización de favoritos)
- **entityType**: Tipo de entidad ('player', 'team', 'match', 'league', 'all')

## API Backend

### Endpoints Disponibles

#### Aplicar Filtros

```
GET /api/search/filter
```

Parámetros de query:

- `q`: Término de búsqueda (opcional)
- `type`: Tipo de entidad
- `league`: ID de liga
- `season`: Temporada
- `position`: Posición (puede ser array)
- `nationality`: Nacionalidad (puede ser array)
- `country`: País (puede ser array)
- `status`: Estado (puede ser array)
- `minAge`: Edad mínima
- `maxAge`: Edad máxima
- `dateFrom`: Fecha desde
- `dateTo`: Fecha hasta
- `teamId`: ID de equipo
- `limit`: Límite de resultados (default: 50)
- `offset`: Offset para paginación (default: 0)

Respuesta:

```json
{
  "results": [...],
  "totalResults": 42,
  "filters": {...}
}
```

#### Obtener Opciones de Filtros

```
GET /api/search/filter/options
```

Respuesta:

```json
{
  "leagues": [...],
  "positions": [...],
  "nationalities": [...],
  "countries": [...],
  "seasons": [...],
  "statuses": [...]
}
```

#### Guardar Filtro Favorito

```
POST /api/search/filter/favorites/:userId
```

Body:

```json
{
  "name": "Delanteros Premier League",
  "config": {
    "league": "premier-league-id",
    "position": ["Delantero", "Extremo"]
  }
}
```

#### Obtener Filtros Favoritos

```
GET /api/search/filter/favorites/:userId
```

#### Eliminar Filtro Favorito

```
DELETE /api/search/filter/favorites/:userId/:filterId
```

## Estructura de Datos

### Objeto de Filtros

```javascript
{
  league: 'league-id',           // ID de liga
  season: '2023/2024',           // Temporada
  position: ['Delantero'],       // Array de posiciones
  nationality: ['Argentina'],    // Array de nacionalidades
  country: ['España'],           // Array de países
  status: ['live', 'finished'],  // Array de estados
  minAge: 20,                    // Edad mínima
  maxAge: 30,                    // Edad máxima
  dateFrom: '2024-01-01',        // Fecha desde
  dateTo: '2024-12-31',          // Fecha hasta
  teamId: 'team-id',             // ID de equipo
  limit: 50,                     // Límite de resultados
  offset: 0                      // Offset para paginación
}
```

### Objeto de Filtro Favorito

```javascript
{
  id: 'filter_1234567890_abc123',
  name: 'Delanteros Premier League',
  config: {
    league: 'premier-league-id',
    position: ['Delantero']
  },
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z'
}
```

## Ejemplos de Uso

### Ejemplo 1: Filtrar Jugadores por Posición y Liga

```javascript
const filters = {
  league: 'premier-league-id',
  position: ['Delantero', 'Extremo'],
  minAge: 20,
  maxAge: 28,
};

await applyCurrentFilters(filters);
```

### Ejemplo 2: Guardar Filtro Favorito

```javascript
const filterConfig = {
  league: 'la-liga-id',
  nationality: ['España', 'Argentina'],
  position: ['Centrocampista'],
};

await saveAsFavorite('Centrocampistas La Liga', filterConfig);
```

### Ejemplo 3: Cargar y Aplicar Filtro Favorito

```javascript
const favoriteFilter = favoriteFilters[0];
loadFavorite(favoriteFilter.config);
await applyCurrentFilters(favoriteFilter.config);
```

### Ejemplo 4: Filtrar Partidos por Fecha y Estado

```javascript
const filters = {
  dateFrom: '2024-01-01',
  dateTo: '2024-01-31',
  status: ['finished'],
  league: 'champions-league-id',
};

await applyCurrentFilters(filters);
```

## Mejores Prácticas

### 1. Validación de Filtros

Siempre valida que los filtros tengan valores antes de aplicarlos:

```javascript
const hasValidFilters = Object.keys(filters).some((key) => {
  const value = filters[key];
  return (
    value !== undefined &&
    value !== null &&
    value !== '' &&
    !(Array.isArray(value) && value.length === 0)
  );
});
```

### 2. Manejo de Errores

Implementa manejo de errores apropiado:

```javascript
try {
  await applyCurrentFilters(filters);
} catch (error) {
  console.error('Error aplicando filtros:', error);
  Alert.alert('Error', 'No se pudieron aplicar los filtros');
}
```

### 3. Optimización de Rendimiento

- Usa debouncing para búsquedas en tiempo real
- Implementa paginación para grandes conjuntos de resultados
- Cachea las opciones de filtros

### 4. Experiencia de Usuario

- Muestra indicadores visuales de filtros activos
- Proporciona feedback inmediato al aplicar filtros
- Permite limpiar filtros fácilmente
- Guarda el estado de filtros entre sesiones

## Requisitos Cumplidos

✅ **Requisito 8.2**: Sistema de filtros implementado

- Filtros por liga, temporada, posición y nacionalidad
- Combinación múltiple de filtros
- Persistencia de filtros favoritos

### Características Implementadas:

1. **Filtros por Liga**: ✅

   - Selección de liga específica
   - Integrado con datos reales de la base de datos

2. **Filtros por Temporada**: ✅

   - Selección de temporada
   - Aplicable a partidos y estadísticas

3. **Filtros por Posición**: ✅

   - Selección múltiple de posiciones
   - Específico para jugadores

4. **Filtros por Nacionalidad**: ✅

   - Selección múltiple de nacionalidades
   - Específico para jugadores

5. **Combinación Múltiple**: ✅

   - Todos los filtros son combinables
   - Lógica AND entre filtros diferentes
   - Lógica OR dentro de filtros múltiples

6. **Persistencia de Filtros Favoritos**: ✅
   - Guardado en servidor con autenticación
   - Cache local para acceso rápido
   - Sincronización entre dispositivos

## Próximos Pasos

### Mejoras Futuras

1. **Filtros Avanzados**

   - Rango de valor de mercado
   - Estadísticas específicas (goles, asistencias)
   - Filtros por lesiones/suspensiones

2. **Búsqueda Inteligente**

   - Sugerencias basadas en historial
   - Filtros recomendados
   - Autocompletado mejorado

3. **Visualización**

   - Gráficos de distribución de resultados
   - Comparación visual de filtros
   - Exportación de resultados

4. **Rendimiento**
   - Índices de base de datos optimizados
   - Cache distribuido
   - Paginación infinita

## Soporte

Para problemas o preguntas sobre el sistema de filtros:

- Revisa la documentación del backend en `futbol-back/src/services/FilterService.js`
- Consulta los ejemplos en `futbol-front/app/(tabs)/search.jsx`
- Verifica los logs de la consola para errores de API
