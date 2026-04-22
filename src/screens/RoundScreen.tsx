import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, BackHandler, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/AppNavigator'
import { useGameStore } from '../store/gameStore'

type Props = NativeStackScreenProps<RootStackParamList, 'Round'>

export function RoundScreen({ navigation }: Props) {
  const players = useGameStore(s => s.players)
  const currentPlayerIndex = useGameStore(s => s.currentPlayerIndex)
  const phase = useGameStore(s => s.phase)

  const currentPlayer = players[currentPlayerIndex]

  // Disable hardware back button
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => sub.remove()
  }, [])

  // Navigate to Result when all players have seen their cards
  useEffect(() => {
    if (phase === 'discussion') {
      navigation.navigate('Result')
    }
  }, [phase, navigation])

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>Pasale el celular a</Text>
      <Text style={styles.playerName}>{currentPlayer?.name ?? ''}</Text>
      <TouchableOpacity
        style={styles.revealBtn}
        onPress={() => navigation.navigate('CardFlip')}
      >
        <Text style={styles.revealBtnText}>Revelar</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#111',
  },
  instruction: {
    fontSize: 20,
    color: '#ccc',
    marginBottom: 12,
  },
  playerName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 48,
  },
  revealBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 10,
  },
  revealBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
})
