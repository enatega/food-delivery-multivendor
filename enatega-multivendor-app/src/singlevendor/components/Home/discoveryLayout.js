import { scale } from '../../../utils/scaling'

// Shared geometry for the Discovery header sections so real content and
// skeletons occupy exactly the same space (no layout shift on load).
export const DISCOVERY_GUTTER = scale(12)

const BANNER_GAP = scale(10)
const BANNER_PEEK = scale(22)
const TABLET_MIN_WIDTH = 768

export const getBannerLayout = (screenWidth, count = 1) => {
  const isTablet = screenWidth >= TABLET_MIN_WIDTH
  const fullWidth = screenWidth - DISCOVERY_GUTTER * 2
  // With more than one banner the next card peeks in from the right edge,
  // hinting that the carousel is swipeable.
  const peekWidth = screenWidth - DISCOVERY_GUTTER - BANNER_GAP - BANNER_PEEK
  const cardWidth = isTablet
    ? Math.min(count > 1 ? peekWidth : fullWidth, 640)
    : count > 1 ? peekWidth : fullWidth
  const cardHeight = Math.round(cardWidth / (isTablet ? 2.5 : 2.05))

  return {
    cardWidth,
    cardHeight,
    gap: BANNER_GAP,
    interval: cardWidth + BANNER_GAP
  }
}
