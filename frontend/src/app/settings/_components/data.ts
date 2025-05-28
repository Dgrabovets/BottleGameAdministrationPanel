export const inputFields = [
  {
    title: "Шанс выигрыша",
    fields: [
      {
        name: "baseWinChance",
        label: "Базовый шанс",
        placeholder: "0.3",
        defaultValue: "0.3",
      },
      {
        name: "minWinChance",
        label: "Мин. шанс",
        placeholder: "0.1",
        defaultValue: "0.1",
      },
      {
        name: "maxWinChance",
        label: "Макс. шанс",
        placeholder: "1",
        defaultValue: "1",
      },
      {
        name: "baseMultiplierProbability",
        label: "Вероятность множителя",
        placeholder: "0.15",
        defaultValue: "0.15",
      },
    ],
  },
  {
    title: "Уменьшение шанса",
    fields: [
      {
        name: "chanceDecPerThrowMin",
        label: "Мин. сниж. за бросок",
        placeholder: "0.1",
        defaultValue: "0.1",
      },
      {
        name: "chanceDecPerThrowMax",
        label: "Макс. сниж. за бросок",
        placeholder: "0.2",
        defaultValue: "0.2",
      },
      {
        name: "chanceDecPerRotation",
        label: "Сниж. за оборот",
        placeholder: "0.05",
        defaultValue: "0.05",
      },
      {
        name: "minRotationWinChance",
        label: "Мин. шанс после оборота",
        placeholder: "0.15",
        defaultValue: "0.15",
      },
    ],
  },
  {
    title: "Множитель выигрыша",
    fields: [
      {
        name: "minMultiplier",
        label: "Мин. множитель",
        placeholder: "2",
        defaultValue: "2",
      },
      {
        name: "maxMultiplier",
        label: "Макс. множитель",
        placeholder: "10",
        defaultValue: "10",
      },
      {
        name: "probabilityFor1_5",
        label: "Вероятность ×1.5",
        placeholder: "0.15",
        defaultValue: "0.15",
      },
      {
        name: "probabilityFor2",
        label: "Вероятность ×2",
        placeholder: "0.15",
        defaultValue: "0.15",
      },
      {
        name: "probabilityFor3",
        label: "Вероятность ×3",
        placeholder: "0.15",
        defaultValue: "0.15",
      },
      {
        name: "probabilityFor5",
        label: "Вероятность ×5",
        placeholder: "0.15",
        defaultValue: "0.15",
      },
      {
        name: "probabilityFor10",
        label: "Вероятность ×10",
        placeholder: "0.15",
        defaultValue: "0.15",
      },
    ],
  },
  {
    title: "Дополнительные параметры",
    fields: [
      {
        name: "initialBalanceLoss",
        label: "Нач. потеря баланса",
        placeholder: "0.12",
        defaultValue: "0.12",
      },
      {
        name: "deviationChance",
        label: "Шанс отклонения",
        placeholder: "0.15",
        defaultValue: "0.15",
      },
      {
        name: "maxDeviationPercent",
        label: "Макс. % отклонения",
        placeholder: "0.9",
        defaultValue: "0.9",
      },
    ],
  },
  {
    title: "Буст выигрыша",
    fields: [
      {
        name: "minGamesForBoost",
        label: "Мин. игр для буста",
        placeholder: "3",
        defaultValue: "3",
      },
      {
        name: "winBoostChance",
        label: "Шанс на буст",
        placeholder: "0.8",
        defaultValue: "0.8",
      },
      {
        name: "winBoostMultiplier",
        label: "Множ. при бусте",
        placeholder: "1.5",
        defaultValue: "1.5",
      },
    ],
  },
  {
    title: "Сброс и контроль",
    fields: [
      {
        name: "hardResetChance",
        label: "Шанс сброса",
        placeholder: "1",
        defaultValue: "1",
      },
      {
        name: "controlGoal",
        label: "Цел. метрика",
        placeholder: "1",
        defaultValue: "1",
      },
    ],
  },
  {
    title: "Визуальные параметры",
    fields: [
      {
        name: "reelSpeed",
        label: "Скор. вращения",
        placeholder: "0",
        defaultValue: "0",
      },
      {
        name: "uprightThresholdForLine",
        label: "Порог наклона",
        placeholder: "15",
        defaultValue: "15",
      },
    ],
  },
];
