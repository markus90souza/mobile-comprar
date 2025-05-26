
import { Image, TouchableOpacity, View, Text, FlatList, Alert } from "react-native"

import { styles } from "./styles"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Filter } from "@/components/Filter"
import { FilterStatus } from "@/types/filter-status"
import { Item } from "@/components/Item"
import { useEffect, useState } from "react"
import { itemStorage, type ItemStorage } from "@/storage/item-storage"

const FILTER_STATUS: FilterStatus[] = [FilterStatus.PENDING, FilterStatus.DONE]


export default function Home() {

  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.PENDING)
  const [description, setDescription] = useState("")
  const [item, setItem] = useState<ItemStorage[]>([])

  const handleAddItem = async () => {
    if (!description.trim()) {
      return Alert.alert("Atenção", "Informe a descrição do item.")
    }

    const newItem = {
      id: Math.random().toString(32).substring(2),
      status: FilterStatus.PENDING,
      description
    }
    
    await itemStorage.add(newItem)
    await getItemByStatus()
    setFilter(FilterStatus.PENDING)
    
    Alert.alert("Sucesso", `${description} adicionado com sucesso!`)
    setDescription("")
  }

  const handleRemoveItem = async (id: string) => {
    Alert.alert("Atenção", "Deseja remover esse item?", [
      {
        text: "Cancelar",
        style: "cancel"
      },
      {
        text: "Remover",
        onPress: async () => {
          await itemStorage.remove(id)
          await getItemByStatus()
          Alert.alert("Sucesso", "Item removido com sucesso!")
        }
      }
    ])
  }

  const handleClear = async () => {
    Alert.alert("Atenção", "Deseja limpar todos os itens?", [
      {
        text: "Cancelar",
        style: "cancel"
      },
      {
        text: "Limpar",
        onPress: async () => {
          await itemStorage.clear()
          setItem([])
          Alert.alert("Sucesso", "Todos os itens foram removidos.")
        }
      }
    ])
  }

  const handleToggleStatus = async (id: string) => {
    try {
      
      await itemStorage.toggleStatus(id)
      await getItemByStatus()
    } catch (error) {
      Alert.alert("Atenção", "Não foi possível alterar o status do item.")
      
    }
  }
  const getItemByStatus = async () => {
    try {
      const response = await itemStorage.getByStatus(filter)
      setItem(response)
    } catch (error) {
      Alert.alert("Atenção", "Não foi possível carregar os itens.")
    }
  }

  useEffect(() => {
    getItemByStatus()
  }, [filter])

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/logo.png')} style={styles.logo} />
      
      <View style={styles.form}>
        <Input 
          placeholder="O que você precisa comprar?"
          onChangeText={setDescription}
          value={description}
        />
        <Button title="Adicionar" onPress={handleAddItem} />
      </View>

      <View style={styles.content}> 
        <View style={styles.header}>
          {FILTER_STATUS.map((status) => (
            <Filter 
              key={status}
              status={status}
              isActive={status === filter}
              onPress={() => setFilter(status)} 
            />
          ))}
          
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <FlatList 
          data={item}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Item
              data={item} 
              onStatus={() => handleToggleStatus(item.id)}
              onRemove={() => handleRemoveItem(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => <Text style={styles.empty}>Nenhum item aqui.</Text>}
        />
        
      </View>
    </View>
  )
}