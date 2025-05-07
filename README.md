# Discovery

A turn-based strategy game about the Portuguese Age of Discovery, inspired by Sid Meier's Colonization and 7 Cities of Gold.

## Game Features

- Grid-based naval exploration
- Turn-based movement system
- Ship navigation mechanics

## Controls

- **Mouse Click**: Move ship to selected cell (within movement range)
- **Space** or **Enter**: End turn
- **Mouse Drag**: Rotate camera
- **Mouse Scroll**: Zoom in/out

## Movement System

- Ships have 3 movement points per turn
- Diagonal movement costs the same as cardinal movement (like in Civilization)
- Green highlights show available movement range
- Movement points refresh when ending the turn

## Development

Running the development server:

```bash
npm run dev
```

## Tech Stack

- React Three Fiber (@react-three/fiber) for 3D rendering
- Drei (@react-three/drei) for Three.js helpers and controls
- React for UI and state management
- TypeScript for type-safe code
- Vite for fast development and building

## Components

- `App`: Main game component managing state and layout
- `Grid`: Renders the ocean grid with clickable cells
- `Ship`: Renders the player's ship with movement capabilities
