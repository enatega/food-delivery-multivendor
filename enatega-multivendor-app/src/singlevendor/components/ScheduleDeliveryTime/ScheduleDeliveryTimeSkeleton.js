import React, { useContext, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../utils/themeColors';
import { scale } from '../../../utils/scaling';

const ShimmerSkeleton = ({ width, height, borderRadius, delay = 0, style }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true
        })
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 2, width * 2]
  });

  return (
    <View style={[styles().skeletonBase, { width, height, borderRadius }, style]}>
      <Animated.View
        style={[
          styles().shimmerContainer,
          {
            transform: [{ translateX }]
          }
        ]}
      >
        <LinearGradient
          colors={[
            'rgba(255,255,255,0)',
            'rgba(255,255,255,0.3)',
            'rgba(255,255,255,0.6)',
            'rgba(255,255,255,0.3)',
            'rgba(255,255,255,0)'
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles().shimmer}
        />
      </Animated.View>
    </View>
  );
};

const ScheduleDeliveryTimeSkeleton = () => {
  const themeContext = useContext(ThemeContext);
  const currentTheme = theme[themeContext.ThemeValue];
  
  // Subtle pulse animation for containers
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.98,
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  return (
    <View style={styles(currentTheme).container}>
      {/* Date Tabs Skeleton - Exact match with enhanced shimmer */}
      <Animated.View style={[styles(currentTheme).dateTabsContainer, { transform: [{ scale: pulseAnim }] }]}>
        <View style={styles(currentTheme).tabsContainer}>
          <View style={styles(currentTheme).tab}>
            <ShimmerSkeleton width="85%" height={18} borderRadius={6} delay={0} />
          </View>
          <View style={styles(currentTheme).tab}>
            <ShimmerSkeleton width="85%" height={18} borderRadius={6} delay={150} />
          </View>
        </View>
      </Animated.View>

      {/* Time Slots Skeleton - Exact match with staggered shimmer */}
      <View style={styles(currentTheme).timeSlotsContainer}>
        {[0, 120, 240, 360].map((delay, index) => (
          <Animated.View 
            key={index} 
            style={[
              styles(currentTheme).timeSlotButton,
              { 
                transform: [{ 
                  scale: pulseAnim.interpolate({
                    inputRange: [0.98, 1],
                    outputRange: [0.99, 1]
                  })
                }] 
              }
            ]}
          >
            <ShimmerSkeleton 
              width="65%" 
              height={20} 
              borderRadius={6} 
              delay={delay}
            />
          </Animated.View>
        ))}
      </View>

      {/* Info Message Skeleton - Exact match with icon shimmer */}
      <View style={styles(currentTheme).bottomInfoContainer}>
        <Animated.View style={[styles(currentTheme).infoContainer, { transform: [{ scale: pulseAnim }] }]}>
          <ShimmerSkeleton 
            width={scale(16)} 
            height={scale(16)} 
            borderRadius={scale(8)} 
            delay={250}
            style={{ marginRight: scale(8) }}
          />
          <ShimmerSkeleton width="72%" height={16} borderRadius={6} delay={300} />
        </Animated.View>
      </View>

      {/* Button Skeleton - Exact match with enhanced shimmer */}
      <View style={styles(currentTheme).buttonContainer}>
        <Animated.View style={[styles(currentTheme).confirmButton, { transform: [{ scale: pulseAnim }] }]}>
          <ShimmerSkeleton width="45%" height={22} borderRadius={6} delay={400} />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : '#fff'
    },
    skeletonBase: {
      backgroundColor: props !== null ? props.gray200 : '#E5E7EB',
      overflow: 'hidden'
    },
    shimmerContainer: {
      width: '100%',
      height: '100%'
    },
    shimmer: {
      width: '100%',
      height: '100%'
    },
    // Date Tabs - Match DateTabs.js exactly
    dateTabsContainer: {
      paddingHorizontal: scale(16),
      paddingTop: scale(16),
      paddingBottom: scale(8)
    },
    tabsContainer: {
      flexDirection: 'row',
      backgroundColor: props !== null ? props.gray100 : '#F3F4F6',
      borderRadius: scale(8),
      padding: scale(4),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1
    },
    tab: {
      flex: 1,
      paddingVertical: scale(10),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: scale(6),
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2
    },
    // Time Slots - Match TimeSlotList.js exactly
    timeSlotsContainer: {
      paddingHorizontal: scale(16),
      paddingTop: scale(8)
    },
    timeSlotButton: {
      paddingVertical: scale(16),
      paddingHorizontal: scale(16),
      marginBottom: scale(12),
      borderRadius: scale(24),
      borderWidth: 1,
      borderColor: props !== null ? props.gray200 : '#E5E7EB',
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2
    },
    // Info Message - Match actual design
    bottomInfoContainer: {
      position: 'absolute',
      bottom: scale(90),
      left: 0,
      right: 0,
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      paddingHorizontal: scale(16),
      paddingTop: scale(12),
      paddingBottom: scale(8),
      borderTopWidth: 1,
      borderTopColor: props !== null ? props.gray200 : '#E5E7EB',
      alignItems: 'center'
    },
    infoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: scale(16),
      paddingVertical: scale(12),
      backgroundColor: props !== null ? props.gray50 : '#F9FAFB',
      borderRadius: scale(8),
      width: '95%',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.04,
      shadowRadius: 2,
      elevation: 1
    },
    // Button - Match actual design
    buttonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      paddingHorizontal: scale(16),
      paddingTop: scale(8),
      paddingBottom: scale(30),
      borderTopWidth: 1,
      borderTopColor: props !== null ? props.gray200 : '#E5E7EB'
    },
    confirmButton: {
      backgroundColor: props !== null ? props.gray200 : '#E5E7EB',
      paddingVertical: scale(14),
      borderRadius: scale(8),
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 3
    }
  });

export default ScheduleDeliveryTimeSkeleton;
