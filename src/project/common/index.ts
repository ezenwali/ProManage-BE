import { Stage } from '../Base/stage';

export const getDefaultStages = () => {
  const defaultStageName = ['Todo', 'In Progress', 'Done'];

  const defaultStages = defaultStageName.map((name) => Stage.create(name));

  return defaultStages;
};
