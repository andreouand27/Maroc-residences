# Maroc Residences

Website for **Alba Residences by Maroc**, eight new apartments in Archangelos, Nicosia, Cyprus.

Built with React, TypeScript, Tailwind CSS and Vite.

## How the site works

The site is a series of full-screen scenes shown one at a time: a logo splash, the hero, the project,
the apartments, the features, a gallery of renders and contact details. Visitors move between them with:

- **Enter** or **Space** (Shift+Space goes back), the arrow keys, Page Up/Down, Home/End
- the mouse wheel or trackpad, one scene per scroll
- swiping up/down on a phone (left/right browses the gallery)
- the navbar, the progress marks on the right, or the "Press Space" prompt at the bottom

Each change of scene has its own transition (see `src/experience/effects.ts`). Visitors who ask their
device for reduced motion get a simple fade instead.

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
npm run preview  # serve the production build
```

## Editing content

- Contact details, location, construction date, availability, features and picture captions: `src/site.ts`
- Scene order, names and which transition each one uses: `src/experience/scenes.ts`
- Each scene's layout and text: `src/scenes/`
- Pictures and logo files: `public/images/`
