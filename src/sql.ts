export const type = Symbol(`sql.type`)

export type ITable = Table<string>

export type ITables = {
    [name : string] : ITable
}

export class Database<
    Name extends string,
    Tables extends ITables,
> {
    public static readonly [type] : unique symbol = Symbol(`sql.Database`)

    public readonly name : Name
    public readonly tables : Tables

    public constructor({
        name,
        tables,
    } : {
        name : Name
        tables : Tables
    }) {
        this.name = name
        this.tables = tables
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
    const tables = {} as const
    const database = new Database({ name, tables })

    return database
}
