# 命名空间

## Codes [<Badge text="classes/cqcode/codes" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/cqcode/codes.ts)
生成CQ码的工具函数。

```ts {2,8,14,20,26,32,38,45,51,55,59,63,69,76,87}
const Codes: {
    Text(text: string): {
        type: string
        data: {
            text: string
        }
    }
    Face(id: number): {
        type: string
        data: {
            id: number
        }
    }
    Emoji(id: number): {
        type: string
        data: {
            id: number
        }
    }
    BFace(id: number): {
        type: string
        data: {
            id: number
        }
    }
    SFace(id: number): {
        type: string
        data: {
            id: number
        }
    }
    Image(file: string): {
        type: string
        data: {
            file: string
        }
    }
    Record(file: string, magic?: boolean): {
        type: string
        data: {
            file: string
            magic: boolean
        }
    }
    At(qq: number | "all"): {
        type: string
        data: {
            qq: number | "all"
        }
    }
    RPS(): {
        type: string
        data: {}
    }
    Dice(): {
        type: string
        data: {}
    }
    Shake(): {
        type: string
        data: {}
    }
    Anonymous(ignore?: boolean): {
        type: string
        data: {
            ignore: boolean
        }
    }
    PlatformMusic(type: "qq" | "163" | "xiami", id: number): {
        type: string
        data: {
            type: "qq" | "163" | "xiami"
            id: number
        }
    }
    CustomMusic(url: string, audio: string, title: string, content?: string, image?: string): {
        type: string
        data: {
            type: string
            url: string
            audio: string
            title: string
            content: string
            image: string
        }
    }
    Share(url: string, title: string, content?: string, image?: string): {
        type: string
        data: {
            url: string
            title: string
            content: string
            image: string
        }
    }
}
```

## Utils [<Badge text="classes/cqcode/utils" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/cqcode/utils.ts)
转换CQ码的工具函数。

```ts {2,3,4,5,6,7,8,9,10}
const Utils: {
    isCQCodeObject(obj: any): obj is ICQCode
    isRealCQCodeObject(obj: any): boolean
    encodePlainText(str: string): string
    decodePlainText(str: string): string
    encodeCQCodeText(str: string): string
    decodeCQCodeText(str: string): string
    arrayToString(message: (string | ICQCode)[]): string
    stringToArray(message: string): any[]
    filterType(message: ICQCode[], type: string): string | ICQCode | ICQCode[]
}
```