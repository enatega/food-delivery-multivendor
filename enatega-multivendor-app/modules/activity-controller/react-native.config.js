module.exports = {
  dependency: {
    platforms: {
      ios: {
        podspecPath: "activity-controller.podspec",
      },
      android: {
        sourceDir: "./android",
        packageImportPath: "import com.enatega.activitycontroller.ActivityControllerPackage;",
        packageInstance: "new ActivityControllerPackage()",
      },
    },
  },
};
