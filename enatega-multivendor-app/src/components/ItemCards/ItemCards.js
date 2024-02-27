import { Image, Text, View } from "react-native";
import { scale } from "../../utils/scaling";
import styles from "./styles";


export const ItemCard=()=>(
  <View style={styles().popularItems}>
    <View style={styles().row}>
      <View
        style={styles().card}>
        <Text
          style={{
            color: '#4B5563',
            fontSize: scale(12),
            fontWeight: '600',
            marginBottom: scale(11)
          }}>
          Cheesy Burger
        </Text>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={{
              uri:
                'https://enatega.com/wp-content/uploads/2024/02/burger-removebg-preview-1.png'
            }}
            style={[{ width: 138, height: 120 }, styles().popularMenuImg]}

          />
          <View style={styles().popularMenuPrice}>
            <Text style={{ color: '#1C1C1E', fontSize: scale(12) }}>
              $3 .00
            </Text>
            <Text
              style={{
                color: '#9CA3AF',
                fontSize: scale(12),
                textDecorationLine: 'line-through'
              }}>
              $3.00
            </Text>
          </View>
        </View>
      </View>
      <LinearGradient
      colors={['#F3F4F6', 'rgba(243, 244, 246, 0)']} // Gradient colors
      start={[0, 0]} // Gradient start point (optional)
      end={[0, 1]} // Gradient end point (optional)
      style={styles().card}>
        <Text
          style={{
            color: '#4B5563',
            fontSize: scale(12),
            fontWeight: '600',
            marginBottom: scale(11)
          }}>
          Cheesy Burger
        </Text>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={{
              uri:
                'https://enatega.com/wp-content/uploads/2024/02/burger-removebg-preview-1.png'
            }}
            style={[{ width: 138, height: 120 }, styles().popularMenuImg]}

          />
          <View style={styles().popularMenuPrice}>
            <Text style={{ color: '#1C1C1E', fontSize: scale(12) }}>
              $3 .00
            </Text>
            <Text
              style={{
                color: '#9CA3AF',
                fontSize: scale(12),
                textDecorationLine: 'line-through'
              }}>
              $3.00
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
    <View style={styles().row}>
      <LinearGradient
        colors={['#F3F4F6', 'rgba(243, 244, 246, 0)']} // Gradient colors
        start={[0, 0]} // Gradient start point (optional)
        end={[0, 1]} // Gradient end point (optional)
        style={styles().card}>
        <Text
          style={{
            color: '#4B5563',
            fontSize: scale(12),
            fontWeight: '600',
            marginBottom: scale(11)
          }}>
          Cheesy Burger
        </Text>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={{
              uri:
                'https://enatega.com/wp-content/uploads/2024/02/burger-removebg-preview-1.png'
            }}
            style={[{ width: 138, height: 120 }, styles().popularMenuImg]}

          />
          <View style={styles().popularMenuPrice}>
            <Text style={{ color: '#1C1C1E', fontSize: scale(12) }}>
              $3 .00
            </Text>
            <Text
              style={{
                color: '#9CA3AF',
                fontSize: scale(12),
                textDecorationLine: 'line-through'
              }}>
              $3.00
            </Text>
          </View>
        </View>
      </LinearGradient>
      <LinearGradient
        colors={['#F3F4F6', 'rgba(243, 244, 246, 0)']} // Gradient colors
        start={[0, 0]} // Gradient start point (optional)
        end={[0, 1]} // Gradient end point (optional)
        style={styles().card}>
        <Text
          style={{
            color: '#4B5563',
            fontSize: scale(12),
            fontWeight: '600',
            marginBottom: scale(11)
          }}>
          Cheesy Burger
        </Text>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={{
              uri:
                'https://enatega.com/wp-content/uploads/2024/02/burger-removebg-preview-1.png'
            }}
            style={[{ width: 138, height: 120 }, styles().popularMenuImg]}

          />
          <View style={styles().popularMenuPrice}>
            <Text style={{ color: '#1C1C1E', fontSize: scale(12) }}>
              $3 .00
            </Text>
            <Text
              style={{
                color: '#9CA3AF',
                fontSize: scale(12),
                textDecorationLine: 'line-through'
              }}>
              $3.00
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  </View>
)