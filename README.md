# El Impostor 🕵️

A mobile party game for a single shared phone, inspired by the popular TikTok game. One player secretly receives the word "IMPOSTOR" while everyone else gets the same secret word. Players discuss, vote, and try to catch the impostor before they're exposed.

## How to play

1. **Configure** — enter player names, pick how many impostors (1 or 2), and choose a category.
2. **Pass the phone** — each player taps their card privately to reveal their role.
3. **Discuss** — talk in the group. Word players try to expose the impostor; the impostor tries to blend in.
4. **Vote** — agree on who you think the impostor is. Reveal the result at the end.

### Categories

| Category | Examples |
|----------|---------|
| Famosos | celebrities |
| Objetos | everyday objects |
| Lugares | places around the world |
| Series | TV shows & movies |
| Animales | animals |

100 words across 5 categories, with more to come.

## Stack

- [Expo](https://expo.dev) SDK 54 (managed workflow)
- React Native 0.76
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [React Navigation](https://reactnavigation.org) Native Stack
- TypeScript
- Jest + jest-expo for unit testing

## Getting started

### Prerequisites

- Node.js 18+
- [Expo Go](https://expo.dev/go) installed on your phone (iOS or Android)

### Run locally

```bash
git clone https://github.com/itscamperezb/Impostor-Game2.git
cd Impostor-Game2
npm install --legacy-peer-deps
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS).

> **WSL2 users**: the internal IP `172.x.x.x` is not reachable from your phone.  
> Use `npx expo start --tunnel` instead. This requires `@expo/ngrok` (already in the dependencies).

### Run tests

```bash
npm test
```

## Project structure

```
src/
├── data/
│   └── words.ts          # 100 words across 5 categories
├── navigation/
│   └── AppNavigator.tsx  # Native Stack routes
├── screens/
│   ├── HomeScreen.tsx
│   ├── ConfigScreen.tsx
│   ├── RoundScreen.tsx
│   ├── CardFlipScreen.tsx
│   └── ResultScreen.tsx
├── store/
│   └── gameStore.ts      # Zustand FSM — game state & actions
├── types/
│   └── game.ts
└── utils/
    └── shuffle.ts        # Fisher-Yates shuffle
```

## Contributing

Issues and pull requests are welcome.

### Reporting a bug

1. Open an [issue](https://github.com/itscamperezb/Impostor-Game2/issues/new) with a clear title.
2. Include: what you expected, what happened, your OS, and Expo Go version.
3. Steps to reproduce if possible.

### Submitting a pull request

1. Fork the repo and create a branch from `master`.
2. Make your changes. If it's a logic change, add or update tests.
3. Run `npm test` — all tests must pass.
4. Open a PR with a short description of what changed and why.

### Ideas for contribution

- Add more words to existing categories
- Add new categories
- Improve the UI / add animations
- Add a timer for the discussion phase
- Add sound effects

## License

MIT
