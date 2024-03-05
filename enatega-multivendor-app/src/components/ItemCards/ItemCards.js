import { FlatList, Image, Text, View } from "react-native";
import { scale } from "../../utils/scaling";
import styles from "./styles";

const ItemCard = ({ item }) => {
  console.log("called");

  return (
    <View style={styles().card}>
        <Text style={{
          color: '#4B5563',
          fontSize: scale(12),
          fontWeight: '600',
          marginBottom: scale(11)
        }}>
          {item.title}
        </Text>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={{ uri: item.image }}
            style={[{ width: 138, height: 120 }, styles().popularMenuImg]}
          />
          <View style={styles().popularMenuPrice}>
            <Text style={{ color: '#1C1C1E', fontSize: scale(12) }}>
              ${item.variations[0].price}
            </Text>
            <Text style={{
              color: '#9CA3AF',
              fontSize: scale(12),
              textDecorationLine: 'line-through'
            }}>
              ${item.variations[0].discounted}
            </Text>
          </View>
        </View>
      </View>
  )
  
}

export default ItemCard;
