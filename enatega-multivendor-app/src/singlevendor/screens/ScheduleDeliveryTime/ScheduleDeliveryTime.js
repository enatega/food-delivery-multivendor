import React, { useState, useContext, useLayoutEffect, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../utils/themeColors';
import { scale } from '../../../utils/scaling';
import { alignment } from '../../../utils/alignment';
import { textStyles } from '../../../utils/textStyles';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';

import TimeSlotList from '../../components/ScheduleDeliveryTime/TimeSlotList';
import DateTabs from '../../components/ScheduleDeliveryTime/DateTabs';
import ScheduleDeliveryTimeSkeleton from '../../components/ScheduleDeliveryTime/ScheduleDeliveryTimeSkeleton';
import { GET_SCHEDULE_BY_DAY } from '../../apollo/queries';
import useScheduleStore from '../../stores/scheduleStore';
import styles from './Styles';

const ScheduleDeliveryTime = (props) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  
  // Get schedule from Zustand store
  const { selectedSchedule, setSchedule } = useScheduleStore();
  
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  // Fetch schedule data from API - refetch on every visit to get latest availability
  const { data, loading, error, refetch } = useQuery(GET_SCHEDULE_BY_DAY, {
    fetchPolicy: 'cache-and-network', // Show cache first, then update with fresh data
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all' // Return partial data even if there's an error
  });

  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [retrying, setRetrying] = useState(false);

  // Handle retry
  const handleRetry = async () => {
    setRetrying(true);
    try {
      await refetch();
    } catch (err) {
      console.log('Retry error:', err);
    } finally {
      setRetrying(false);
    }
  };

  // Generate dates from API response
  useEffect(() => {
    if (data && data.getScheduleByDay && data.getScheduleByDay.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Only take first 2 days from API response
      const generatedDates = data.getScheduleByDay.slice(0, 2).map((schedule, index) => {
        const scheduleDate = new Date(schedule.date);
        scheduleDate.setHours(0, 0, 0, 0);
        
        // Format as "Day Month" (e.g., "1 Jan")
        const day = scheduleDate.getDate();
        const monthName = scheduleDate.toLocaleString('en-US', { month: 'short' });
        const dateFormat = `${day} ${monthName}`;
        
        let label = '';
        if (scheduleDate.getTime() === today.getTime()) {
          label = `${t('Today') || 'Today'}, ${dateFormat}`;
        } else if (scheduleDate.getTime() === tomorrow.getTime()) {
          label = `${t('Tomorrow') || 'Tomorrow'}, ${dateFormat}`;
        } else {
          label = dateFormat;
        }

        return {
          id: schedule.day + '_' + index,
          dayId: schedule?.dayId,
          label: label,
          date: schedule.date,
          dayName: schedule.day,
          fullDate: scheduleDate
        };
      });

      setDates(generatedDates);
      
      // Restore from Zustand store or set first date as default
      if (selectedSchedule && selectedSchedule.date) {
        const previousDate = generatedDates.find(d => d.date === selectedSchedule.date);
        if (previousDate && !selectedDate) {
          setSelectedDate(previousDate);
        }
      } else if (!selectedDate && generatedDates.length > 0) {
        setSelectedDate(generatedDates[0]);
      }
    }
  }, [data, t, selectedSchedule]);

  // Process API data and update time slots when selectedDate changes
  useEffect(() => {
    if (data && data.getScheduleByDay && selectedDate) {
      const scheduleForDay = data.getScheduleByDay.find(
        schedule => schedule.day === selectedDate.dayName
      );

      if (scheduleForDay && scheduleForDay.timings && scheduleForDay.timings.length > 0) {
        const slots = [];
        
        // Check if selected date is today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isToday = selectedDate.fullDate.getTime() === today.getTime();
        
        // Add "As soon as possible" option for today
        if (isToday) {
          slots.push({
            id: 'asap',
            time: t('As soon as possible') || 'As soon as possible',
            startTime: '',
            endTime: ''
          });
        }

        // Process timings from API
        scheduleForDay.timings.forEach(timing => {
          if (timing.times && timing.times.length > 0) {
            timing.times.forEach(timeSlot => {
              // Extract first element from arrays
              const startTime = Array.isArray(timeSlot.startTime) 
                ? timeSlot.startTime[0] 
                : timeSlot.startTime;
              const endTime = Array.isArray(timeSlot.endTime) 
                ? timeSlot.endTime[0] 
                : timeSlot.endTime;

              slots.push({
                id: timeSlot.id,
                time: `${startTime} - ${endTime}`,
                startTime: startTime,
                endTime: endTime,
                maxOrder: timeSlot.maxOrder
              });
            });
          }
        });

        setTimeSlots(slots);
      } else {
        // No schedule found for this day
        setTimeSlots([]);
      }
    }
  }, [data, selectedDate, t]);

  // Restore previous time slot selection when time slots are loaded
  useEffect(() => {
    if (timeSlots.length > 0 && selectedSchedule && selectedSchedule.timeSlot && 
        selectedSchedule.date === selectedDate?.date && !selectedTimeSlot) {
      const previousTimeSlot = timeSlots.find(slot => slot.id === selectedSchedule.timeSlot.id);
      if (previousTimeSlot) {
        setSelectedTimeSlot(previousTimeSlot);
      }
    }
  }, [timeSlots, selectedSchedule, selectedDate, selectedTimeSlot]);

  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(currentTheme.menuBar);
      }
      StatusBar.setBarStyle(
        themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
      );
    }, [currentTheme, themeContext])
  );

  useLayoutEffect(() => {
    props?.navigation.setOptions({
      title: t('Schedule delivery time') || 'Schedule delivery time',
      headerRight: null,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.newFontcolor,
        ...textStyles.H4,
        ...textStyles.Bolder
      },
      headerTitleContainerStyle: {
        paddingLeft: scale(25),
        paddingRight: scale(25)
      },
      headerStyle: {
        backgroundColor: currentTheme.newheaderBG,
        shadowColor: 'transparent',
        shadowRadius: 0,
        shadowOffset: { height: 0 },
        elevation: 0,
        borderBottomWidth: 0,
        height: scale(100),
       

      },
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=''
          backImage={() => (
            <View style={{ ...alignment.PLsmall, alignItems: 'center' }}>
              <View style={{
                width: scale(36),
                height: scale(36),
                borderRadius: scale(18),
                backgroundColor: currentTheme.colorBgTertiary || '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
              }}>
                <AntDesign 
                  name='arrowleft' 
                  size={20} 
                  color={currentTheme.fontMainColor || '#000'} 
                />
              </View>
            </View>
          )}
          onPress={() => navigation.goBack()}
        />
      )
    });
  }, [props?.navigation, currentTheme]);

  const handleDateSelect = (date) => {
    console.log('📅 Date Selected:', date.label, '(' + date.date + ')');
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (slot) => {
    console.log('⏰ Time Slot Selected:', {
      id: slot.id,
      time: slot.time,
      startTime: slot.startTime,
      endTime: slot.endTime
    });
    setSelectedTimeSlot(slot);
  };

  const handleConfirm = () => {
    if (selectedTimeSlot) {
      console.log('🚀 Confirming Schedule Selection...',selectedDate);
      const scheduleData = {
        dayId: selectedDate.dayId,
        date: selectedDate.date,
        dateLabel: selectedDate.label,
        dayName: selectedDate.dayName,
        timeSlot: selectedTimeSlot
      };
      
      console.log('✅ Schedule Confirmed:', {
        date: scheduleData.dateLabel,
        day: scheduleData.dayName,
        timeSlotId: scheduleData.timeSlot.id,
        time: scheduleData.timeSlot.time,
        startTime: scheduleData.timeSlot.startTime,
        endTime: scheduleData.timeSlot.endTime,
        fullData: scheduleData
      });
      
      // Save to Zustand store
      setSchedule(scheduleData);
      
      // Pass data back via callback if provided
      if (props.route?.params?.onScheduleSelected) {
        props.route.params.onScheduleSelected(scheduleData);
      }
      
      navigation.goBack();
    }
  };

  return (
    <View style={styles(currentTheme).mainContainer}>
      {loading && !data ? (
        <ScheduleDeliveryTimeSkeleton />
      ) : error && !data ? (
        <View style={styles(currentTheme).errorContainer}>
          <AntDesign 
            name='exclamationcircleo' 
            size={48} 
            color={currentTheme.fontSecondColor}
            style={{ marginBottom: scale(16) }}
          />
          <TextDefault
            textColor={currentTheme.fontMainColor}
            center
            isRTL
            bold
            H5
            style={{ marginBottom: scale(8) }}
          >
            {t('Unable to load schedule') || 'Unable to load schedule'}
          </TextDefault>
          <TextDefault
            textColor={currentTheme.fontSecondColor}
            center
            isRTL
            small
            style={{ marginBottom: scale(24), paddingHorizontal: scale(32) }}
          >
            {t('Please check your internet connection and try again.') || 'Please check your internet connection and try again.'}
          </TextDefault>
          <TouchableOpacity
            style={styles(currentTheme).retryButton}
            onPress={handleRetry}
            disabled={retrying}
            activeOpacity={0.7}
          >
            {retrying ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <TextDefault
                textColor="#fff"
                bold
                isRTL
              >
                {t('Try Again') || 'Try Again'}
              </TextDefault>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView 
            style={styles().scrollView}
            contentContainerStyle={styles().contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Date Tabs - Show only if dates are available */}
            {dates.length > 0 && (
              <DateTabs
                dates={dates}
                selectedDate={selectedDate}
                onSelectDate={handleDateSelect}
              />
            )}

            {/* Time Slots List */}
            {timeSlots.length > 0 ? (
              <TimeSlotList
                timeSlots={timeSlots}
                selectedTimeSlot={selectedTimeSlot}
                onSelectTimeSlot={handleTimeSlotSelect}
              />
            ) : (
              <View style={styles(currentTheme).noSlotsContainer}>
                <TextDefault
                  textColor={currentTheme.fontSecondColor}
                  center
                  isRTL
                >
                  {t('No time slots available for this day.') || 'No time slots available for this day.'}
                </TextDefault>
              </View>
            )}

            {/* Spacer for button */}
            <View style={{ height: scale(100) }} />
          </ScrollView>

          {/* Info Message - Fixed at bottom */}
          <View style={styles(currentTheme).bottomInfoContainer}>
            <View style={styles(currentTheme).infoContainer}>
              <AntDesign 
                name='warning' 
                size={16} 
                color={currentTheme.fontSecondColor} 
                style={styles().infoIcon}
              />
              <TextDefault
                textColor={currentTheme.fontSecondColor}
                small
                isRTL
                center
                bolder
                style={styles().infoText}
              >
                {t('Pre-order not available on Sundays & holidays.') || 
                 'Pre-order not available on Sundays & holidays.'}
              </TextDefault>
            </View>
          </View>

          {/* Confirm Button */}
          <View style={styles(currentTheme).bottomContainer}>
            <TouchableOpacity
              style={[
                styles(currentTheme).confirmButton,
                !selectedTimeSlot && styles(currentTheme).confirmButtonDisabled
              ]}
              onPress={handleConfirm}
              disabled={!selectedTimeSlot}
              activeOpacity={0.7}
            >
              <TextDefault
                textColor={selectedTimeSlot ? '#fff' : currentTheme.fontSecondColor}
                bolder
                H5
              >
                {t('Confirm') || 'Confirm'}
              </TextDefault>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default ScheduleDeliveryTime;
