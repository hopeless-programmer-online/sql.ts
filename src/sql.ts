export const type = Symbol(`sql.type`)

export type ITable = Table<string>

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

export class Table<
    Name extends string,
> {
    public static readonly [type] : unique symbol = Symbol(`sql.Table`)

    public readonly name : Name

    public constructor({
        name,
    } : {
        name : Name
    }) {
        this.name = name
    }

    public get [type]() : typeof Table[typeof type] {
        return Table[type]
    }
}

/**
 * Creates an empty database.
 */
export function database<Name extends string>(name : Name) {
    const database = new Database({ name })

    return database
}
