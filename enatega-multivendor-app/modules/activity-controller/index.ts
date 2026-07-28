import { NativeModules } from 'react-native';

const { ActivityController } = NativeModules;

export default {
  areLiveActivitiesEnabled: ActivityController.areLiveActivitiesEnabled,
  startLiveActivity: ActivityController.startLiveActivity,
  updateLiveActivity: ActivityController.updateLiveActivity,
  stopLiveActivity: ActivityController.stopLiveActivity,
  isLiveActivityRunning: ActivityController.isLiveActivityRunning,
  saveImageToAppGroup: ActivityController.saveImageToAppGroup,
  cleanAppGroupImages: ActivityController.cleanAppGroupImages,
};
