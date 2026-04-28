import React from 'react'
import React, { useRef, useState } from 'react'
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView
} from 'react-native'

const { width } = Dimensions.get('window')

const App = () => {
  const categories = [
    { id: '1', name: 'Category 1', subCategories: ['1.1', '1.2', '1.3'] },
    { id: '2', name: 'Category 2', subCategories: ['2.1', '2.2', '2.3'] },
    { id: '3', name: 'Category 3', subCategories: ['3.1', '3.2'] },
    { id: '4', name: 'Category 4', subCategories: ['4.1'] },
    { id: '5', name: 'Category 5', subCategories: ['5.1', '5.2', '5.3'] }
  ]

  const [selectedCategory, setSelectedCategory] = useState('1')
  const [selectedSubCategory, setSelectedSubCategory] = useState('1.1')
  const scrollRef = useRef(null)

  const categoryRefs = useRef({})
  const subCategoryRefs = useRef({})

  const handleCategoryPress = (id) => {
    setSelectedCategory(id)
    const firstSub = categories.find((cat) => cat.id === id).subCategories[0]
    setSelectedSubCategory(firstSub)
    scrollToSection(id, firstSub)
  }

  const handleSubCategoryPress = (categoryId, subId) => {
    setSelectedCategory(categoryId)
    setSelectedSubCategory(subId)
    scrollToSection(categoryId, subId)
  }

  const scrollToSection = (categoryId, subId) => {
    const key = `${categoryId}-${subId}`
    const node = subCategoryRefs.current[key]
    if (node) {
      node.measureLayout(scrollRef.current, (x, y) => {
        scrollRef.current.scrollTo({ x: 0, y, animated: true })
      })
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Category Slider */}
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.slider}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleCategoryPress(item.id)}
              style={[
                styles.sliderItem,
                selectedCategory === item.id && styles.selectedItem
              ]}
            >
              <Text style={styles.sliderText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        {/* Sub-Category Slider */}
        <FlatList
          horizontal
          data={
            categories.find((cat) => cat.id === selectedCategory).subCategories
          }
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.slider}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSubCategoryPress(selectedCategory, item)}
              style={[
                styles.sliderItem,
                selectedSubCategory === item && styles.selectedItem
              ]}
            >
              <Text style={styles.sliderText}>{item}</Text>
            </TouchableOpacity>
          )}
        />

        {/* Content */}
        <ScrollView ref={scrollRef}>
          {categories.map((category) =>
            category.subCategories.map((sub) => (
              <View
                key={`${category.id}-${sub}`}
                style={styles.section}
                ref={(node) =>
                  (subCategoryRefs.current[`${category.id}-${sub}`] = node)
                }
              >
                <Text style={styles.sectionText}>
                  {`Section for ${category.name} - ${sub}`}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  slider: { padding: 10 },
  sliderItem: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    marginHorizontal: 5
  },
  selectedItem: { backgroundColor: '#6200ee' },
  sliderText: { color: '#000' },
  section: {
    height: 200,
    width,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  sectionText: { fontSize: 18, fontWeight: 'bold' }
})

export default App
