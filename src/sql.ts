export const type = Symbol(`sql.type`)

export class Database<
    Name extends string,
> {
    public static readonly [type] : unique symbol = Symbol(`sql.Database`)

    public readonly name : Name

    public constructor({
        name,
    } : {
        name : Name
    }) {
        this.name = name
    }

    public get [type]() : typeof Database[typeof type] {
        return Database[type]
    }
}

export function database<Name extends string>(name : Name) {
    const database = new Database({ name })

    return database
}
