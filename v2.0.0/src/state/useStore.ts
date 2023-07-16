import { Color } from "three";
import { RefObject, createRef } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type GameState = {
  gameStarted: boolean;
  controls: {
    w: boolean;
    a: boolean;
    s: boolean;
    d: boolean;
  };
  directionalLight: RefObject<unknown>;
  camera: RefObject<unknown>;
  ship: RefObject<unknown>;
  sun: RefObject<unknown>;
  sfx: RefObject<unknown>;
};

type GameActions = {
  updateGameState: (input: Partial<GameState>) => void;
};

export const useGameStore = create(
  immer<GameState & GameActions>((set, get) => ({
    gameStarted: false,
    //musicEnabled: JSON.parse(localStorage.getItem("musicEnabled")) ?? false,
    controls: {
      w: false,
      a: false,
      s: false,
      d: false,
    },
    directionalLight: createRef(),
    camera: createRef(),
    ship: createRef(),
    sun: createRef(),
    sfx: createRef(),

    updateGameState: (input) => {
      set((state) => {
        state.c;
      });
    },
  }))
);
