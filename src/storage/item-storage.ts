import AsyncStorage from "@react-native-async-storage/async-storage";
import { FilterStatus } from "@/types/filter-status";

const ITEM_STORAGE = "@comprar:items";

export type ItemStorage = {
  id: string;
  status: FilterStatus;
  description: string;
}

const get = async (): Promise<ItemStorage[]> => {
  try {
    const storage = await AsyncStorage.getItem(ITEM_STORAGE);
    return storage ? JSON.parse(storage) : [];
  } catch (error) {
    throw new Error("Get items error" + error);
  }

}

const getByStatus = async (status: FilterStatus): Promise<ItemStorage[]> => {
  try {
    const items = await get();
    return items.filter((item) => item.status === status);
  } catch (error) {
    throw new Error("Get items by status error" + error);
  }
  
}
const save = async (items: ItemStorage[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(ITEM_STORAGE, JSON.stringify(items));
  } catch (error) {
    throw new Error("Save items error" + error);
  }
}

const add = async (item: ItemStorage): Promise<ItemStorage[]> => {
  try {
    const items = await get();
    const newItems = [...items, item];
    await save(newItems);
    return newItems;
  } catch (error) {
    throw new Error("Add items error" + error);
  }
}

const remove = async (id: string): Promise<void> => {
  try {
    const items = await get();
    const newItems = items.filter((item) => item.id !== id);
    await save(newItems);
  } catch (error) {
    throw new Error("Remove items error" + error);
  }
}


const clear = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ITEM_STORAGE);
  } catch (error) {
    throw new Error("Clear items error" + error);
  }
}
async function toggleStatus(id: string): Promise<void> {
  const items = await get()

  const updatedItems = items.map((item) => 
    item.id === id
    ? {
      ...item,
      status: item.status === FilterStatus.PENDING
        ? FilterStatus.DONE
       : FilterStatus.PENDING,
    }
    : item
  )

  await save(updatedItems)
}

export const itemStorage = { 
  get,
  getByStatus,
  add,
  remove,
  clear,
  toggleStatus
};