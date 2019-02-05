export interface IModuleMetadata {
    name: string
    author: string
    version: string
    license: string
    description?: string
    registrations: string[]
}

export interface IRegistrationMetadata {
    name: string
    module: string
    usage: string
}

const modulesMetadata: IModuleMetadata[] = []
const registrationsMetadata: IRegistrationMetadata[] = []

export function useModule(data: IModuleMetadata) { modulesMetadata.push(data) }

export function useRegistration(data: IRegistrationMetadata) { registrationsMetadata.push(data) }

export function getAllModules() { return modulesMetadata }

export function getModule(name: string) { return modulesMetadata.find(data => data.name === name) }

export function getAllRegistrations(moduleName: string) { return registrationsMetadata.filter(data => data.module === moduleName) }

export function getRegistration(moduleName: string, name: string) { return registrationsMetadata.find(data => data.name === name && data.module === moduleName) }
