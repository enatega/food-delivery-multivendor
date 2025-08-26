let navObj = null

function setGlobalRef(ref) {
  navObj = ref
}

function navigate(path, props = {}) {
  navObj.navigate(path, props)
}

function goBack() {
  navObj.goBack()
}

export default {
  setGlobalRef,
  navigate,
  goBack
}
