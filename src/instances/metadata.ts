export interface IModuleMetadata {
    name: string
    author?: string
    version?: string
    license?: string
    description?: string
    registrations?: string[]
}

export interface IRegistrationMetadata {
    name: string
    module: string
    usage?: string
}

const modulesMetadata: IModuleMetadata[] = []
const registrationsMetadata: IRegistrationMetadata[] = []

/**
 * Register a module's metadata
 * @param data the module's metadata
 */
export function useModule(data: IModuleMetadata) { modulesMetadata.push(data) }

/**
 * Register a registration's metadata
 * @param data the registration's metadata
 */
export function useRegistration(data: IRegistrationMetadata) { registrationsMetadata.push(data) }

/** Get all modules' metadata */
export function getAllModules() { return modulesMetadata }

/**
 * Get a module's metadata
 * @param name the module's name
 */
export function getModule(name: string) { return modulesMetadata.find(data => data.name === name) }

/**
 * Get all registrations' metadata of a module
 * @param moduleName the module's name
 */
export function getAllRegistrations(moduleName: string) { return registrationsMetadata.filter(data => data.module === moduleName) }

/**
 * Get a registration's metadata of a module
 * @param moduleName the module's name
 * @param name the registration's name
 */
export function getRegistration(moduleName: string, name: string) { return registrationsMetadata.find(data => data.name === name && data.module === moduleName) }
