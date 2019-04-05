export interface ICQCode {
    type: string
    data: { [x: string]: any }
}

export type ICQCodeArray = (string|ICQCode)[]
