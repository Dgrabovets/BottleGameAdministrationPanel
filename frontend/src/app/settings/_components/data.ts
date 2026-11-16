/** Definitions of the game settings form: groups of fields with their labels and keys */
export const inputFields = [
  {
    title: "Win chance",
    fields: [
      {
        name: "baseWinChance",
        label: "Base chance",
        placeholder: "0.3",
        defaultValue: "0.3",
      },
      {
        name: "minWinChance",
        label: "Min. chance",
        placeholder: "0.1",
        defaultValue: "0.1",
      },
      {
        name: "maxWinChance",
        label: "Max. chance",
        placeholder: "1",
        defaultValue: "1",
      },
      {
        name: "baseMultiplierProbability",
        label: "Multiplier probability",
        placeholder: "0.15",
        defaultValue: "0.15",
      },
    ],
  },
  {
    title: "Chance reduction",
    fields: [
      {
        name: "chanceDecPerThrowMin",
        label: "Min. reduction per throw",
        placeholder: "0.1",
        defaultValue: "0.1",
      },
      {
        name: "chanceDecPerThrowMax",
        label: "Max. reduction per throw",
        placeholder: "0.2",
        defaultValue: "0.2",
      },
      {
        name: "chanceDecPerRotation",
        label: "Reduction per turn",
        placeholder: "0.05",
        defaultValue: "0.05",
      },
      {
        name: "minRotationWinChance",
        label: "Min. chance after a turn",
        placeholder: "0.15",
        defaultValue: "0.15",
      },
    ],
  },
  {
    title: "Win multiplier",
    fields: [
      {
        name: "minMultiplier",
        label: "Min. multiplier",
        placeholder: "2",
        defaultValue: "2",
      },
      {
        name: "maxMultiplier",
        label: "Max. multiplier",
        placeholder: "10",
        defaultValue: "10",
      },
      {
        name: "probabilityFor1_5",
        label: "Probability ×1.5",
        placeholder: "0.15",
        defaultValue: "0.15",
      },
      {
        name: "probabilityFor2",
        label: "Probability ×2",
        placeholder: "0.15",
        defaultValue: "0.15",
      },
      {
        name: "probabilityFor3",
        label: "Probability ×3",
        placeholder: "0.15",
        defaultValue: "0.15",
      },
      {
        name: "probabilityFor5",
        label: "Probability ×5",
        placeholder: "0.15",
        defaultValue: "0.15",
      },
      {
        name: "probabilityFor10",
        label: "Probability ×10",
        placeholder: "0.15",
        defaultValue: "0.15",
      },
    ],
  },
  {
    title: "Additional parameters",
    fields: [
      {
        name: "initialBalanceLoss",
        label: "Initial balance loss",
        placeholder: "0.12",
        defaultValue: "0.12",
      },
      {
        name: "deviationChance",
        label: "Deviation chance",
        placeholder: "0.15",
        defaultValue: "0.15",
      },
      {
        name: "maxDeviationPercent",
        label: "Max. deviation %",
        placeholder: "0.9",
        defaultValue: "0.9",
      },
    ],
  },
  {
    title: "Win boost",
    fields: [
      {
        name: "minGamesForBoost",
        label: "Min. games for a boost",
        placeholder: "3",
        defaultValue: "3",
      },
      {
        name: "winBoostChance",
        label: "Boost chance",
        placeholder: "0.8",
        defaultValue: "0.8",
      },
      {
        name: "winBoostMultiplier",
        label: "Multiplier on a boost",
        placeholder: "1.5",
        defaultValue: "1.5",
      },
    ],
  },
  {
    title: "Reset and control",
    fields: [
      {
        name: "hardResetChance",
        label: "Reset chance",
        placeholder: "1",
        defaultValue: "1",
      },
      {
        name: "controlGoal",
        label: "Target metric",
        placeholder: "1",
        defaultValue: "1",
      },
    ],
  },
  {
    title: "Visual parameters",
    fields: [
      {
        name: "reelSpeed",
        label: "Spin speed",
        placeholder: "0",
        defaultValue: "0",
      },
      {
        name: "uprightThresholdForLine",
        label: "Tilt threshold",
        placeholder: "15",
        defaultValue: "15",
      },
    ],
  },
];
