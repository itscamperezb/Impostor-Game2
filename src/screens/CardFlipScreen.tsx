import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/AppNavigator'
import { useGameStore } from '../store/gameStore'

type Props = NativeStackScreenProps<RootStackParamList, 'CardFlip'>

export function CardFlipScreen({ navigation }: Props) {
  const players = useGameStore(s => s.players)
  const currentPlayerIndex = useGameStore(s => s.currentPlayerIndex)
  const currentWord = useGameStore(s => s.currentWord)
  const markPlayerViewed = useGameStore(s => s.markPlayerViewed)

  const currentPlayer = players[currentPlayerIndex]
  const isImpostor = currentPlayer?.role === 'impostor'

  const [revealed, setRevealed] = useState(false)

  function handleReveal() {
    if (revealed) return
    setRevealed(true)
    markPlayerViewed()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.playerName}>{currentPlayer?.name ?? ''}</Text>
      <Text style={styles.hint}>
        {revealed ? '' : 'Tocá la carta para ver tu rol'}
      </Text>

      <TouchableOpacity
        onPress={handleReveal}
        activeOpacity={revealed ? 1 : 0.7}
        style={[styles.card, revealed && styles.cardRevealed]}
      >
        {!revealed ? (
          <>
            <Text style={styles.cardBackPattern}>🂠</Text>
            <Text style={styles.cardBackLabel}>Tocar para revelar</Text>
          </>
        ) : isImpostor ? (
          <Text style={styles.roleImpostor}>IMPOSTOR</Text>
        ) : (
          <>
            <Text style={styles.roleWordLabel}>La palabra es:</Text>
            <Text style={styles.roleWord}>{currentWord}</Text>
          </>
        )}
      </TouchableOpacity>

      {revealed && (
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate('Round')}
        >
          <Text style={styles.continueBtnText}>Continuar</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
    padding: 24,
  },
  playerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: '#888',
    marginBottom: 40,
    height: 20,
  },
  card: {
    width: 240,
    height: 340,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a2e',
    borderWidth: 2,
    borderColor: '#4a4a8a',
  },
  cardRevealed: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  cardBackPattern: {
    fontSize: 80,
    color: '#4a4a8a',
    marginBottom: 12,
  },
  cardBackLabel: {
    fontSize: 14,
    color: '#888',
  },
  roleImpostor: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#c00',
    letterSpacing: 2,
  },
  roleWordLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  roleWord: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  continueBtn: {
    marginTop: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 10,
  },
  continueBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111',
  },
})
