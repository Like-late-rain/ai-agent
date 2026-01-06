/**
 * @file Base Repository
 * @description Base CRUD operations for JSON file-based storage
 */

import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { v4 as uuidv4 } from 'uuid'

/**
 * File lock manager to prevent concurrent writes
 */
class FileLockManager {
  private locks: Map<string, Promise<void>> = new Map()

  /**
   * Acquire a lock for a file
   */
  async acquire(filePath: string): Promise<() => void> {
    // Wait for any existing lock to release
    const existingLock = this.locks.get(filePath)
    if (existingLock) {
      await existingLock
    }

    // Create a new lock
    let releaseLock: () => void
    const lockPromise = new Promise<void>((resolve) => {
      releaseLock = resolve
    })

    this.locks.set(filePath, lockPromise)

    // Return the release function
    return () => {
      this.locks.delete(filePath)
      releaseLock?.()
    }
  }
}

const lockManager = new FileLockManager()

/**
 * Base repository class for JSON file-based CRUD operations
 */
export class BaseRepository<T extends { id: string }> {
  protected filePath: string

  /**
   * Constructor
   * @param fileName - Name of the JSON file (without path)
   */
  constructor(fileName: string) {
    this.filePath = path.join(__dirname, '../data', fileName)
  }

  /**
   * Read all data from file
   */
  protected async readFile(): Promise<T[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8')
      return JSON.parse(data)
    } catch (error: any) {
      // If file doesn't exist, return empty array
      if (error.code === 'ENOENT') {
        return []
      }
      throw error
    }
  }

  /**
   * Write data to file with locking
   */
  protected async writeFile(data: T[]): Promise<void> {
    const release = await lockManager.acquire(this.filePath)
    try {
      // Ensure directory exists
      const dir = path.dirname(this.filePath)
      await fs.mkdir(dir, { recursive: true })

      // Write data
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8')
    } finally {
      release()
    }
  }

  /**
   * Find all records
   */
  async findAll(): Promise<T[]> {
    return await this.readFile()
  }

  /**
   * Find a record by ID
   */
  async findById(id: string): Promise<T | null> {
    const data = await this.readFile()
    return data.find((item) => item.id === id) || null
  }

  /**
   * Find one record matching predicate
   */
  async findOne(predicate: (item: T) => boolean): Promise<T | null> {
    const data = await this.readFile()
    return data.find(predicate) || null
  }

  /**
   * Find many records matching predicate
   */
  async findMany(predicate: (item: T) => boolean): Promise<T[]> {
    const data = await this.readFile()
    return data.filter(predicate)
  }

  /**
   * Create a new record
   */
  async create(data: Omit<T, 'id'>): Promise<T> {
    const allData = await this.readFile()

    const newRecord = {
      ...data,
      id: uuidv4(),
    } as T

    allData.push(newRecord)
    await this.writeFile(allData)

    return newRecord
  }

  /**
   * Update a record by ID
   */
  async update(id: string, data: Partial<T>): Promise<T | null> {
    const allData = await this.readFile()
    const index = allData.findIndex((item) => item.id === id)

    if (index === -1) {
      return null
    }

    // Merge the updates
    allData[index] = {
      ...allData[index],
      ...data,
      id, // Ensure ID doesn't change
    }

    await this.writeFile(allData)
    return allData[index]
  }

  /**
   * Delete a record by ID
   */
  async delete(id: string): Promise<boolean> {
    const allData = await this.readFile()
    const initialLength = allData.length
    const filteredData = allData.filter((item) => item.id !== id)

    if (filteredData.length === initialLength) {
      return false
    }

    await this.writeFile(filteredData)
    return true
  }

  /**
   * Count records
   */
  async count(): Promise<number> {
    const data = await this.readFile()
    return data.length
  }

  /**
   * Count records matching predicate
   */
  async countWhere(predicate: (item: T) => boolean): Promise<number> {
    const data = await this.readFile()
    return data.filter(predicate).length
  }
}
