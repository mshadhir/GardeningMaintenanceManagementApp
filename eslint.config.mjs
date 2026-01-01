import nextPlugin from '@next/eslint-plugin-next';

const coreWebVitals = nextPlugin.configs['core-web-vitals'];

export default [
  {
    ...coreWebVitals,
    rules: {
      ...coreWebVitals.rules,
      '@next/next/no-img-element': 'off'
    }
  }
];
