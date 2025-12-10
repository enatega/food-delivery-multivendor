import BronzeIcon from "../assets/SVG/bronze"
import GoldIcon from "../assets/SVG/gold"
import PlatinumIcon from "../assets/SVG/platinum"
import SilverIcon from "../assets/SVG/silver"

 export const getReferralIcon = (tier_name) => {
    switch (tier_name) {
      case 'bronze':
        return <BronzeIcon />
      case 'silver':
        return <SilverIcon />
      case 'gold':
        return <GoldIcon />
      case 'platinum':
        return <PlatinumIcon />
    }
  }
