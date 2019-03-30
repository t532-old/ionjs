export function Text(text: string) { return { type: 'text', data: { text } } }
export function Face(id: number) { return { type: 'face', data: { id } } }
export function Emoji(id: number) { return { type: 'emoji', data: { id } } }
export function BFace(id: number) { return { type: 'bface', data: { id } } }
export function SFace(id: number) { return { type: 'sface', data: { id } } }
export function Image(file: string) { return { type: 'image', data: { file } } }
export function Record(file: string, magic: boolean = false) { return { type: 'record', data: { file, magic } } }
export function At(qq: number|'all') { return { type: 'at', data: { qq } } }
export function RPS() { return { type: 'rps', data: { } } }
export function Dice() { return { type: 'dice', data: { } } }
export function Shake() { return { type: 'shake', data: { } } }
export function Anonymous(ignore: boolean = false) { return { type: 'anonymous', data: { ignore } } }
export function PlatformMusic(type: 'qq'|'163'|'xiami', id: number) { return { type: 'music', data: { type, id } } }
export function CustomMusic(url: string, audio: string, title: string, content?: string, image?: string) { return { type: 'music', data: { type: 'custom', url, audio, title, content, image } } }
export function Share(url: string, title: string, content?: string, image?: string) { return { type: 'share', data: { url, title, content, image } } }