import { IPair } from '~/models/timeTable';

const checkAllowedPairRender = (
  pair: IPair,
  didRenderFirstPair: boolean,
  showGapsBetweenPairs: boolean,
  showEmptyPairs: boolean
) => {
  const isPairEmpty = pair.lessons.length === 0 && !pair.event;
  return !isPairEmpty || (showGapsBetweenPairs && didRenderFirstPair) || showEmptyPairs;
};

export { checkAllowedPairRender };
