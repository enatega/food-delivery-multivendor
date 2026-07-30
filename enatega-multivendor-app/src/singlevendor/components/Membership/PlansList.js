import React, { useContext, useMemo } from 'react'
import { View } from 'react-native'
import PlanCard from './PlanCard'
import styles from '../../screens/Membership/styles'
import UserContext from '../../../context/User'

const PlansList = ({ plans, selectedPlan, onSelectPlan, currentTheme, configurations, onCancel, activePlanId }) => {
  
  return (
    <View style={styles(currentTheme).plansContainer}>
      {plans?.map((plan) => {
      const isActive = useMemo(() => activePlanId ? plan?.id === activePlanId : false, [plan?.id, activePlanId])
        return (
          <PlanCard
          key={plan.id}
          plan={plan}
          isSelected={selectedPlan === plan.id}
          onSelect={() => onSelectPlan(plan.id)}
          currentTheme={currentTheme}
          configurations={configurations}
          onCancel={onCancel}
          isActive={isActive}
        />
        )
      })}
    </View>
  )
}

export default PlansList
