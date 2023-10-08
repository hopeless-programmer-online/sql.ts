export const type = Symbol(`sql.type`)

export type IDatabase = Database<string, ITables>

export type ITable = Table<string>

export type ITables = {
    [name : string] : ITable
}

export type EmptyTable<
    Name extends string,
> = Table<Name>

export type ExtendedTables<
    Tables extends ITables,
    Name extends string,
> = Tables & {
    [name in Name] : EmptyTable<Name>
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
    } : Readonly<{
        name : Name
        tables : Tables
    }>) {
        this.name = name
        this.tables = tables
    }

    public get [type]() : typeof Database[typeof type] {
        return Database[type]
    }
}

export class DatabaseBuilder<
    Database_ extends IDatabase,
> {
    public static readonly [type] : unique symbol = Symbol(`sql.DatabaseBuilder`)

    public readonly database : Database_

    public constructor({
        database,
    } : Readonly<{
        database : Database_
    }>) {
        this.database = database
    }

    public get [type]() : typeof DatabaseBuilder[typeof type] {
        return DatabaseBuilder[type]
    }

    public end() {
        return this.database
    }
    public table<
        Name extends string,
    >(
        name : Name,
    ) {
        const database = new Database<
            Database_[`name`],
            ExtendedTables<Database_[`tables`], Name>
        >({
            name : this.database.name,
            tables : {
                ...this.database.tables,
                [name] : new Table({ name }),
            } as ExtendedTables<Database_[`tables`], Name>, // @todo: remove hack
        })
        const builder = new TableBuilder({
            database,
            current : name,
        })

        return builder
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

export class TableBuilder<
    Database_ extends IDatabase,
    Name extends string & keyof Database_[`tables`],
> {
    public static readonly [type] : unique symbol = Symbol(`sql.DatabaseBuilder`)

    public readonly database : Database_
    public readonly current : Name

    public constructor({
        database,
        current,
    } : {
        database : Database_
        current : Name
    }) {
        this.database = database
        this.current = current
    }

    public get [type]() : typeof DatabaseBuilder[typeof type] {
        return DatabaseBuilder[type]
    }

    public end() {
        return this.database
    }
}

/**
 * Creates an empty database.
 */
export function database<Name extends string>(name : Name) {
    const tables = {} as const
    const database = new Database({ name, tables })
    const builder = new DatabaseBuilder({ database })

    return builder
}

const table = <
    Database_ extends IDatabase,
>(
    database : Database_,
) => <
    Name extends string,
>(
    name : Name,
) => {
    const new_database = new Database<
        Database_[`name`],
        Database_[`tables`] & { [name in Name] : Table<Name> }
    >({
        name : database.name,
        tables : {
            ...database.tables,
            [name] : new Table({ name }),
        } as Database_[`tables`] & { [name in Name] : Table<Name> }, // @todo: remove hack
    })
}
