export const type = Symbol(`sql.type`)

export type IDatabase = Database<string, ITables>

export type ITable = Table<string, IAttributes>

export type ITables = {
    [name : string] : ITable
}

export type EmptyTable<
    Name extends string,
> = Table<Name, {}>

export type ExtendedTables<
    Tables extends ITables,
    Table_ extends ITable,
> = Tables & {
    [name in Table_[`name`]] : Table_
}

export type IAttribute = Attribute<string>

export type IAttributes = {
    [name : string] : IAttribute
}

export type ExtendedAttributes<
    Attributes_ extends IAttributes,
    Attribute_ extends IAttribute,
> = Attributes_ & {
    [name in Attribute_[`name`]] : Attribute_
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
        return add_empty_table(this.database, name)
    }
}

export class Table<
    Name extends string,
    Attributes extends IAttributes,
> {
    public static readonly [type] : unique symbol = Symbol(`sql.Table`)

    public readonly name : Name
    public readonly attributes : Attributes

    public constructor({
        name,
        attributes,
    } : {
        name : Name
        attributes : Attributes
    }) {
        this.name = name
        this.attributes = attributes
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
    public table<
        Name extends string,
    >(
        name : Name,
    ) {
        return add_empty_table(this.database, name)
    }
    public attribute<
        AttributeName extends string,
    >(
        name : AttributeName,
    ) {
        const attribute = new Attribute({ name })
        const current_table = this.database.tables[this.current]
        const attributes = {
            ...current_table.attributes,
            [name] : attribute,
        } as ExtendedAttributes<
            Database_[`tables`][AttributeName][`attributes`],
            Attribute<AttributeName>
        >
        const table = new Table({
            name : current_table.name,
            attributes,
        })
        const tables = {
            ...this.database.tables,
            [this.current] : table,
        } as ExtendedTables<
            Database_[`tables`],
            Table<Name, ExtendedAttributes<
                Database_[`tables`][AttributeName][`attributes`],
                Attribute<AttributeName>
            >>
        >
        const database = new Database<
            Database_[`name`],
            ExtendedTables<
                Database_[`tables`],
                Table<Name, ExtendedAttributes<
                    Database_[`tables`][AttributeName][`attributes`],
                    Attribute<AttributeName>
                >>
            >
        >({
            name : this.database.name,
            tables,
        })
        const builder = new TableBuilder({
            database,
            current : this.current,
        })

        return builder
    }
}

export class Attribute<
    Name extends string,
> {
    public static readonly [type] : unique symbol = Symbol(`sql.Attribute`)

    public readonly name : Name

    public constructor({
        name,
    } : {
        name : Name
    }) {
        this.name = name
    }

    public get [type]() : typeof Attribute[typeof type] {
        return Attribute[type]
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

/**
 * Adds an empty table to the database.
 */
function add_empty_table<
    Database_ extends IDatabase,
    Name extends string,
>(
    database : Database_,
    name : Name,
) {
    const attributes = {} as const
    const table = new Table({ name, attributes })
    const new_database = new Database<
        Database_[`name`],
        ExtendedTables<Database_[`tables`], EmptyTable<Name>>
    >({
        name : database.name,
        tables : {
            ...database.tables,
            [name] : table,
        } as ExtendedTables<Database_[`tables`], EmptyTable<Name>>, // @todo: remove hack
    })
    const builder = new TableBuilder({
        database : new_database,
        current : name,
    })

    return builder
}

function add_attribute<
    Database_ extends IDatabase,
    Name extends string,
>(
    database : Database_,
    name : Name,
){
    const attribute = new Attribute({ name })
}
