import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/AppNavigator'
import { useGameStore } from '../store/gameStore'

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>

export function ResultScreen({ navigation }: Props) {
  const players = useGameStore(s => s.players)
  const currentWord = useGameStore(s => s.currentWord)
  const resetGame = useGameStore(s => s.resetGame)

  const impostors = players.filter(p => p.role === 'impostor')

  function handlePlayAgain() {
    resetGame()
    navigation.navigate('Home')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultado</Text>

      <Text style={styles.sectionLabel}>La palabra era:</Text>
      <Text style={styles.word}>{currentWord}</Text>

      <Text style={styles.sectionLabel}>
        {impostors.length === 1 ? 'El impostor era:' : 'Los impostores eran:'}
      </Text>
      {impostors.map(p => (
        <Text key={p.id} style={styles.impostorName}>
          {p.name}
        </Text>
      ))}

      <TouchableOpacity style={styles.playAgainBtn} onPress={handlePlayAgain}>
        <Text style={styles.playAgainBtnText}>Jugar de nuevo</Text>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 16,
    marginBottom: 8,
  },
  word: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  impostorName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#f55',
    marginBottom: 4,
  },
  playAgainBtn: {
    marginTop: 48,
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 10,
  },
  playAgainBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111',
  },
})
