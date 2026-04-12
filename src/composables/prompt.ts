// management of prompt config items

import { storage } from "#imports"
import { DEFAULT_PROMPT_ID_KEY, PROMPT_CONFIG_KEY } from "../constants/storage-key"
import { PromptConfigItem } from "../types/config/prompt"
import { uid } from "radash"
import useWxtStorage from "./useWxtStorage"
import { presetPrompts } from "../presets/prompts"



/**
 * return reactive prompt config items using WxtStorage.
 *
 * This hook provides the state, error, loading status, and readiness status
 * of the prompt configurations stored in WxtStorage.
 *
 * @return  `state`: The current state of the prompt configurations.
 * @return `error`: Any error encountered while loading the prompt configurations.
 * @return `isLoading`: A boolean indicating if the prompt configurations are currently being loaded.
 * @return `isReady`: A boolean indicating if the prompt configurations are ready to be used.
 */
export function usePromptConfigs() {
  const { state, error, isLoading, isReady } = useWxtStorage<PromptConfigItem[]>(PROMPT_CONFIG_KEY, [])
  return { state, error, isLoading, isReady }
}

/**
 * Manages prompt configuration items in storage.
 */
export function usePromptConfigStorage() {
  // Define storage items for prompt configurations and the default prompt item ID.
  const promptStorage = storage.defineItem<PromptConfigItem[]>(PROMPT_CONFIG_KEY, { fallback: [] })
  const defaultPromptItemIdStorage = storage.defineItem<string | null>(DEFAULT_PROMPT_ID_KEY, { fallback: null })

  /**
   * Checks if a prompt configuration with the given name already exists in the storage.
   * @param name The name of the prompt configuration to check.
   * @returns A boolean indicating whether a prompt configuration with the given name exists.
   */
  async function isNameExist(name: string, id?: string): Promise<boolean> {
    // Retrieve the current prompt configurations from storage
    const prompts = await promptStorage.getValue()

    // Check if any of the prompts have the provided name
    return prompts.some(prompt => prompt.name === name && prompt.id !== id)
  }
  /**
   * Creates a new prompt configuration item.
   * @param configItem The prompt configuration item to create.
   * @returns True if the item was created successfully, false otherwise.
   */
  async function createItem(configItem: PromptConfigItem) {
    // Get the current prompts from storage.
    const prompts = await promptStorage.getValue()
    // If a prompt with the same name already exists, add a number to the name.
    while (prompts.findIndex(p => p.name === configItem.name) !== -1) {
      configItem.name = configItem.name + '(1)'
    }
    // Generate a unique ID for the prompt configuration item.
    configItem.id = uid(16)
    // Add the new prompt configuration item to the list.
    prompts.push(configItem)
    // If this is the first prompt, set it as the default.
    if (prompts.length === 1) {
      await defaultPromptItemIdStorage.setValue(configItem.id)
    }
    //write back
    await promptStorage.setValue(prompts)
    return true;
  }

  /**
   * Updates an existing prompt configuration item.
   * @param configItem The prompt configuration item to update.
   * @returns True if the item was updated successfully, false otherwise.
   */
  async function updateItem(configItem: PromptConfigItem) {
    // Get the current prompts from storage.
    const prompts = await promptStorage.getValue()
    // Find the index of the prompt configuration item to update.
    const index = prompts.findIndex(p => p.id === configItem.id)

    // If the prompt configuration item was not found, return false.
    if (index === -1) {
      return { isSuc: false, msg: `item record not found` }
    }
    // If a prompt with the same name already exists, add a number to the name.
    if (prompts.findIndex(p => p.name === configItem.name && p.id !== configItem.id) !== -1) {
      return { isSuc: false, msg: `name:<${configItem.name}> already exists` }
    }
    const nextPrompts = [...prompts]
    // Update the prompt configuration item in the list.
    nextPrompts[index] = { ...configItem }
    //write back
    await promptStorage.setValue(nextPrompts)
    return { isSuc: true, msg: `success!` };
  }

  /**
   * Lists all prompt configuration items.
   * @returns A list of all prompt configuration items.
   */
  async function listItem() {
    return await promptStorage.getValue()
  }

  /**
   * Deletes a prompt configuration item.
   * @param id The ID of the prompt configuration item to delete.
   * @returns True if the item was deleted successfully, false otherwise.
   */
  async function deleteItem(id: string) {
    // Get the current prompts from storage.
    const prompts = await promptStorage.getValue()
    // Find the index of the prompt configuration item to delete.
    const index = prompts.findIndex(p => p.id === id)
    // If the prompt configuration item was not found, return false.
    if (index === -1) {
      return false
    }
    prompts.splice(index, 1)
    // If there are no more prompts, set the default prompt item ID to null.
    if (prompts.length === 0) {
      await defaultPromptItemIdStorage.setValue(null)
    }
    // write back
    await promptStorage.setValue(prompts)
    return true
  }

  /**
   * Updates the order of a prompt configuration item in the list.
   * @param id The ID of the prompt configuration item to update.
   * @param direction The direction to move the item in ('up' or 'down').
   * @returns True if the item was moved successfully, false otherwise.
   */
  async function updateConfigOrder(id: string, direction: 'up' | 'down') {
    // Get the current prompts from storage.
    const prompts = await promptStorage.getValue()
    // Find the index of the prompt configuration item to update.
    const index = prompts.findIndex(p => p.id === id)
    // If the prompt configuration item was not found, return false.
    if (index === -1) return false
    // If the item is already at the top or bottom of the list, return false.
    if (direction === 'up' && index === 0) return false
    if (direction === 'down' && index === prompts.length - 1) return false
    // Calculate the index of the item to exchange with.
    let exchangeIndex = direction === 'up' ? index - 1 : index + 1
    // Exchange the items in the list.
    const temp = prompts[index]
    prompts[index] = prompts[exchangeIndex]
    prompts[exchangeIndex] = temp


    // write back
    await promptStorage.setValue(prompts)
    return true
  }

  /**
   * Sets the default prompt configuration item ID.
   * @param id The ID of the prompt configuration item to set as the default.
   * @returns True if the default prompt configuration item ID was set successfully, false otherwise.
   */
  async function setDefaultItemId(id: string) {
    // Get the current prompts from storage.
    const prompts = await promptStorage.getValue()
    // Find the index of the prompt configuration item to set as the default.
    const index = prompts.findIndex(p => p.id === id)
    // If the prompt configuration item was not found, return false.
    if (index === -1) return false
    // Set the default prompt configuration item ID.
    await defaultPromptItemIdStorage.setValue(id)
    return true
  }


  async function getDefaultItem() {
    const defaultId = await defaultPromptItemIdStorage.getValue()
    if (!defaultId) {
      return null
    }
    return getItem(defaultId)
  }

  async function getItem(id: string) {
    const prompts = await promptStorage.getValue()
    return prompts.find(p => p.id === id)
  }
  // Return the functions to manage prompt configuration items.
  return { isNameExist, getItem, createItem, updateItem, listItem, deleteItem, updateConfigOrder, setDefaultItemId, getDefaultItem }
}


export function usePromptDefaultPreset() {
  const basic = presetPrompts['basic']
  return {
    systemMessage: basic[0].content as string,
    userMessage: basic[1].content as string
  }
}

export function usePromptPreset(key: string) {
  const preset = presetPrompts[key]
  return {
    systemMessage: preset[0].content as string,
    userMessage: preset[1].content as string
  }
}