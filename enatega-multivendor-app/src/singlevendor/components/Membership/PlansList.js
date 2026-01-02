import React from 'react'
import { View } from 'react-native'
import PlanCard from './PlanCard'
import styles from '../../screens/Membership/styles'

const PlansList = ({ plans, selectedPlan, onSelectPlan, currentTheme }) => {
  return (
    <View style={styles(currentTheme).plansContainer}>
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          isSelected={selectedPlan === plan.id}
          onSelect={() => onSelectPlan(plan.id)}
          currentTheme={currentTheme}
        />
      ))}
    </View>
  )
}

export default PlansList
