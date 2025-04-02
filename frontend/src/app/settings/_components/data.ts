export const inputFields = [
  {
    title: "Шанс выигрыша",
    fields: [
      {
        name: "baseWinChance",
        label: "Базовый шанс",
        placeholder: "25",
      },
      {
        name: "minWinChance",
        label: "Мин. шанс",
        placeholder: "15",
        defaultValue: "0",
      },
      {
        name: "maxWinChance",
        label: "Макс. шанс",
        placeholder: "40",
        defaultValue: "0",
      },
    ],
  },
  {
    title: "Уменьшение шанса",
    fields: [
      {
        name: "chanceDecPerThrowMin",
        label: "Мин. сниж. за бросок",
        placeholder: "5",
        defaultValue: "0",
      },
      {
        name: "chanceDecPerThrowMax",
        label: "Макс. сниж. за бросок",
        placeholder: "10",
        defaultValue: "0",
      },
      {
        name: "chanceDecPerRotation",
        label: "Сниж. за оборот",
        placeholder: "3",
        defaultValue: "0",
      },
      {
        name: "minRotationWinChance",
        label: "Мин. шанс после оборота",
        placeholder: "5",
        defaultValue: "0",
      },
    ],
  },
  {
    title: "Множитель выигрыша",
    fields: [
      {
        name: "minMultiplier",
        label: "Мин. множитель",
        placeholder: "1",
        defaultValue: "0",
      },
      {
        name: "maxMultiplier",
        label: "Макс. множитель",
        placeholder: "5",
        defaultValue: "0",
      },
    ],
  },
  {
    title: "Дополнительные параметры",
    fields: [
      {
        name: "initialBalanceLoss",
        label: "Нач. потеря баланса",
        placeholder: "0",
        defaultValue: "0",
      },
      {
        name: "deviationChance",
        label: "Шанс отклонения",
        placeholder: "10",
        defaultValue: "0",
      },
      {
        name: "maxDeviationPercent",
        label: "Макс. % отклонения",
        placeholder: "20",
        defaultValue: "0",
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
        defaultValue: "0",
      },
      {
        name: "winBoostChance",
        label: "Шанс на буст",
        placeholder: "15",
        defaultValue: "0",
      },
      {
        name: "winBoostMultiplier",
        label: "Множ. при бусте",
        placeholder: "2",
        defaultValue: "0",
      },
    ],
  },
  {
    title: "Сброс и контроль",
    fields: [
      {
        name: "hardResetChance",
        label: "Шанс сброса",
        placeholder: "5",
        defaultValue: "0",
      },
      {
        name: "controlGoal",
        label: "Цел. метрика",
        placeholder: "100",
        defaultValue: "0",
      },
    ],
  },
  {
    title: "Визуальные параметры",
    fields: [
      {
        name: "reelAdvanceSpeed",
        label: "Скор. вращения",
        placeholder: "1",
        defaultValue: "0",
      },
      {
        name: "uprightThresholdForLine",
        label: "Порог наклона",
        placeholder: "10",
        defaultValue: "0",
      },
    ],
  },
];
