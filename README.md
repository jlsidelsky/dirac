# 3D Model Builder

A single-page React + TypeScript application for creating hierarchical 3D models from geometric primitives with a tree-based interface and 3D visualization powered by Three.js.

## Features

- **Hierarchical Model Tree**: Create nested assemblies with primitives
- **Geometric Primitives**: Add boxes, cylinders, cones, spheres, toruses, and planes
- **3D Visualization**: Real-time 3D rendering with Three.js
- **Drag and Drop**: Reorder components in the model tree
- **Property Editing**: Edit position, rotation, scale, and primitive properties
- **Click Selection**: Select objects from either the tree view or 3D view
- **Command Palette**: Press `Cmd+K` (or `Ctrl+K` on Windows/Linux) to quickly access commands
- **Transform Controls**: Manipulate 3D position, orientation, and scale
- **Visual Feedback**: Selected objects are highlighted in the 3D view

## Installation

1. Clone or navigate to the project directory
2. Install dependencies:

```bash
pnpm install
```

## Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## Building

Build for production:

```bash
pnpm build
```

The built files will be in the `dist` directory.

## Preview Production Build

Preview the production build locally:

```bash
pnpm preview
```

## Testing Locally

1. Start the dev server: `pnpm dev`
2. Open the application in your browser
3. Test features:
   - Add primitives using the "Add Primitive" button
   - Add assemblies using the "Add Assembly" button
   - Click on items in the tree or 3D view to select them
   - Edit properties in the right panel
   - Drag items in the tree to reorder them
   - Press `Cmd+K` to open the command palette

## Usage

### Adding Primitives

1. Click "Add Primitive" in the Model Tree panel
2. Enter a name for the primitive
3. Select a primitive type (Box, Cylinder, Cone, Sphere, Torus, Plane)
4. The primitive will appear in the tree and 3D view

### Adding Assemblies

1. Click "Add Assembly" in the Model Tree panel
2. Enter a name for the assembly
3. The assembly can contain primitives and other assemblies

### Selecting Objects

- Click on any item in the Model Tree panel
- Or click directly on objects in the 3D view
- Selected objects are highlighted in green

### Editing Properties

When an object is selected:

- **Name**: Edit the object's name
- **Visibility**: Toggle visibility
- **Transform**: Adjust position (X, Y, Z), rotation (radians), and scale
- **Primitive Properties**: For primitives, edit dimensions (width, height, depth, radius, etc.)

### Reordering Components

- Drag and drop items in the Model Tree to reorder them within the same parent
- Items can be reordered within their parent assembly

### 3D View Controls

- **Orbit**: Left-click and drag to rotate the camera
- **Pan**: Right-click and drag (or middle mouse button) to pan
- **Zoom**: Scroll wheel to zoom in/out

### Command Palette

Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to open the command palette:

- Search and select nodes
- Quick actions: Add Box, Add Assembly, etc.

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for Three.js
- **shadcn/ui** - UI component library (Radix UI + Tailwind)
- **Tailwind CSS** - Styling
- **@dnd-kit** - Drag and drop functionality
- **cmdk** - Command palette component

## Project Structure

```
src/
├── components/
│   ├── ModelTree/        # Tree view component with drag-and-drop
│   ├── View3D/           # Three.js 3D view components
│   ├── PropertyPanel/    # Property editor panel
│   ├── PrimitiveSelector/ # Primitive selection UI
│   ├── ui/               # shadcn/ui components
│   └── CommandPalette.tsx # Command palette (Cmd+K)
├── store/
│   ├── ModelStore.tsx    # State management (Context + reducer)
│   └── modelActions.ts   # Action types and reducer
├── types/
│   ├── model.ts          # Core data model types
│   ├── primitives.ts     # Primitive type definitions
│   └── threejs.ts        # Three.js type extensions
├── utils/
│   ├── treeUtils.ts      # Tree manipulation utilities
│   ├── threejsHelpers.ts # Three.js helper functions
│   └── uuid.ts           # ID generation
└── constants/
    └── primitives.ts     # Primitive definitions and defaults
```

## Future Enhancements

Features planned for future implementation:

- Multiple camera views (top, front, side, isometric)
- Camera pan/zoom controls in separate viewports
- Enhanced command palette with more shortcuts
- Undo/Redo functionality
- Export to GLTF/OBJ formats
- Import models
- Material editor
- Grid snapping
- Animation support

## License

MIT
