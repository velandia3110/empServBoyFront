# Arquitectura del Proyecto

## Estructura de Carpetas

```
src/app/
├── core/                          # Servicios compartidos, guards, interceptores
│
├── shared/                        # Componentes reutilizables en toda la app
│   └── components/
│       ├── navbar/                # Barra de navegación
│       └── footer/                # Pie de página
│
└── pages/                         # Páginas/pantallas principales
    └── home/
        ├── components/            # Componentes específicos de esta página
        │   ├── hero-section/      # Sección hero principal
        │   ├── section-features/  # Sección de características
        │   └── section-services/  # Sección de servicios/precios
        ├── services/              # Servicios específicos de home
        ├── home.component.ts      # Componente contenedor
        ├── home.component.html
        └── home.component.css
```

## Principios de Clean Architecture Aplicados

### 1. **Separación de Responsabilidades**
- **Core**: Contiene la lógica de negocio compartida
- **Shared**: Componentes y servicios reutilizables
- **Pages**: Pantallas específicas de la aplicación
- **Components**: Elementos visuales sin lógica compleja

### 2. **Componentes Standalone**
Todos los componentes son standalone para mayor modularidad y mejor tree-shaking:
```typescript
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [...],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
```

### 3. **Inyección de Dependencias**
Se usa inyección de dependencias para servicios y componentes

### 4. **Componentes Contenedores vs Presentacionales**
- **Contenedores** (HomeComponent): Orquestan la lógica y datos
- **Presentacionales** (HeroSection, Features, Services): Solo muestran datos

## Cómo Agregar Nuevas Características

### Para agregar una nueva página:
1. Crea la carpeta en `src/app/pages/[nombre-pagina]`
2. Crea el componente contenedor `[nombre-pagina].component.ts`
3. Crea los componentes específicos en `components/`
4. Agrega servicios si es necesario en `services/`

### Para agregar un componente compartido:
1. Crea la carpeta en `src/app/shared/components/[nombre]`
2. Crea el componente con `standalone: true`
3. Importa donde sea necesario

## Servicios

Los servicios se organizan según su contexto:
- Servicios globales → `src/app/core/`
- Servicios de página específica → `src/app/pages/[pagina]/services/`

## Estilos

- Se usa **Tailwind CSS** para estilos
- Archivos `.css` están disponibles para estilos personalizados específicos del componente
- Variables y mixins pueden ir en `styles.css` global

## Rutas (Future)

Cuando se implemente routing:
```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  // más rutas...
];
```
