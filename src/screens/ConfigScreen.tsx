import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/AppNavigator'
import { useGameStore } from '../store/gameStore'
import { Category, PlayerState } from '../types/game'

type Props = NativeStackScreenProps<RootStackParamList, 'Config'>

const CATEGORIES: Category[] = ['famosos', 'objetos', 'lugares', 'series', 'animales']

export function ConfigScreen({ navigation }: Props) {
  const [names, setNames] = useState<string[]>(['', '', ''])
  const [numImpostors, setNumImpostors] = useState(1)
  const [category, setCategory] = useState<Category>('famosos')

  const { setPlayers, setNumImpostors: storeSetNumImpostors, setCategory: storeSetCategory, startGame } = useGameStore()

  const validNames = names.filter(n => n.trim().length > 0)
  const canStart = validNames.length >= 3

  const maxImpostors = Math.min(2, Math.max(1, validNames.length - 1))

  useEffect(() => {
    if (numImpostors > maxImpostors) setNumImpostors(maxImpostors)
  }, [maxImpostors])

  function addPlayer() {
    setNames(prev => [...prev, ''])
  }

  function removePlayer(index: number) {
    if (names.length <= 3) {
      Alert.alert('Mínimo 3 jugadores')
      return
    }
    setNames(prev => prev.filter((_, i) => i !== index))
  }

  function updateName(index: number, value: string) {
    setNames(prev => prev.map((n, i) => (i === index ? value : n)))
  }

  function incrementImpostors() {
    setNumImpostors(prev => Math.min(prev + 1, maxImpostors))
  }

  function decrementImpostors() {
    setNumImpostors(prev => Math.max(prev - 1, 1))
  }

  function handleStart() {
    if (!canStart) return

    const players: PlayerState[] = validNames.map((name, i) => ({
      id: String(i),
      name: name.trim(),
      role: 'word',
      hasSeenCard: false,
    }))

    setPlayers(players)
    storeSetNumImpostors(numImpostors)
    storeSetCategory(category)
    startGame()
    navigation.navigate('Round')
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Configurar partida</Text>

      <Text style={styles.sectionLabel}>Jugadores</Text>
      {names.map((name, i) => (
        <View key={i} style={styles.playerRow}>
          <TextInput
            style={styles.input}
            placeholder={`Jugador ${i + 1}`}
            value={name}
            onChangeText={value => updateName(i, value)}
          />
          <TouchableOpacity onPress={() => removePlayer(i)} style={styles.removeBtn}>
            <Text style={styles.removeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={addPlayer} style={styles.addBtn}>
        <Text style={styles.addBtnText}>+ Agregar jugador</Text>
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>Impostores</Text>
      <View style={styles.stepper}>
        <TouchableOpacity onPress={decrementImpostors} style={styles.stepBtn}>
          <Text style={styles.stepBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.stepValue}>{numImpostors}</Text>
        <TouchableOpacity onPress={incrementImpostors} style={styles.stepBtn}>
          <Text style={styles.stepBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionLabel}>Categoría</Text>
      <View style={styles.categoryRow}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setCategory(cat)}
            style={[styles.chip, category === cat && styles.chipSelected]}
          >
            <Text style={[styles.chipText, category === cat && styles.chipTextSelected]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleStart}
        style={[styles.startBtn, !canStart && styles.startBtnDisabled]}
        disabled={!canStart}
      >
        <Text style={styles.startBtnText}>Jugar</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  removeBtn: {
    marginLeft: 8,
    padding: 8,
  },
  removeBtnText: {
    fontSize: 16,
    color: '#c00',
  },
  addBtn: {
    marginTop: 4,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  addBtnText: {
    color: '#555',
    fontSize: 15,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 22,
    lineHeight: 26,
  },
  stepValue: {
    fontSize: 20,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#aaa',
    backgroundColor: '#f0f0f0',
  },
  chipSelected: {
    backgroundColor: '#222',
    borderColor: '#222',
  },
  chipText: {
    fontSize: 13,
    color: '#333',
  },
  chipTextSelected: {
    color: '#fff',
  },
  startBtn: {
    marginTop: 32,
    backgroundColor: '#222',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  startBtnDisabled: {
    backgroundColor: '#aaa',
  },
  startBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
})
