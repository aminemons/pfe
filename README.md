# Soutenance — Diffusion des nanoparticules dans la matière grise cérébrale

Présentation web interactive (React + Vite + reveal.js) — Master Nanophysique, ENSM Alger.
Design éditorial « thèse LaTeX » (typographie Computer Modern serif, palette bleue),
graphiques et schémas **animés** (courbes MSD / D(t) qui se tracent, trajectoire
brownienne, schéma des forces, conditions périodiques).

## Lancer en local

**Prérequis :** [Node.js](https://nodejs.org) (version 18 ou plus).

```bash
npm install        # une seule fois
npm run dev        # serveur de développement -> http://localhost:3000
```

Pour générer la version finale (dossier `dist/`, déployable n'importe où) :

```bash
npm run build
npm run preview    # prévisualise le build
```

## Présenter

- Ouvrir le navigateur en **plein écran** (touche `F11`).
- Avancer / reculer : **flèches** ← → (ou Espace).
- Certaines diapositives se construisent en plusieurs étapes (forces, équations) :
  un appui sur → révèle l'élément suivant.
- Vue d'ensemble de toutes les diapos : touche `Échap` (ou `O`).
- L'URL garde la position (`#/14`), pratique pour reprendre à une diapo précise.

## Structure

```
src/
├── data/slides.tsx              # tout le contenu des diapositives
├── components/
│   ├── PresentationEngine.tsx   # moteur reveal.js + animations (GSAP)
│   └── Diagrams.tsx             # graphiques & schémas animés réutilisables
├── assets/images/               # figures réelles extraites du mémoire
└── index.css                    # thème, polices, animations CSS
```

Pour **modifier un texte**, éditer `src/data/slides.tsx` (le serveur `npm run dev`
recharge automatiquement). Les couleurs et la typographie sont dans `index.css`
et en haut de `Diagrams.tsx`.
