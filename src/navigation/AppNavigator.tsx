import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeScreen } from '../screens/HomeScreen'
import { ConfigScreen } from '../screens/ConfigScreen'
import { RoundScreen } from '../screens/RoundScreen'
import { ResultScreen } from '../screens/ResultScreen'
import { CardFlipScreen } from '../screens/CardFlipScreen'

export type RootStackParamList = {
  Home: undefined
  Config: undefined
  Round: undefined
  CardFlip: undefined
  Result: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Config" component={ConfigScreen} />
      <Stack.Screen
        name="Round"
        component={RoundScreen}
        options={{ gestureEnabled: false, headerShown: false }}
      />
      <Stack.Screen
        name="CardFlip"
        component={CardFlipScreen}
        options={{ gestureEnabled: false, headerShown: false }}
      />
      <Stack.Screen name="Result" component={ResultScreen} />
    </Stack.Navigator>
  )
}
