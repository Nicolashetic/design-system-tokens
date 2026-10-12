export default {
  title: 'Composants/Button',
};

export const Primary = {
  name: 'Primaire',
  render: () => '<button class="ds-button ds-button--primary">Valider</button>',
};

export const PrimaryLarge = {
  name: 'Primaire grand',
  render: () =>
    '<button class="ds-button ds-button--primary ds-button--lg">Valider</button>',
};

export const PrimaryDisabled = {
  name: 'Primaire désactivé',
  render: () =>
    '<button class="ds-button ds-button--primary" disabled>Désactivé</button>',
};

export const Secondary = {
  name: 'Secondaire',
  render: () =>
    '<button class="ds-button ds-button--secondary">Annuler</button>',
};

export const SecondaryLarge = {
  name: 'Secondaire grand',
  render: () =>
    '<button class="ds-button ds-button--secondary ds-button--lg">Annuler</button>',
};

export const SecondaryDisabled = {
  name: 'Secondaire désactivé',
  render: () =>
    '<button class="ds-button ds-button--secondary" disabled>Désactivé</button>',
};
