export const type = Symbol(`sql.type`)

export type IDatabase = Database<string, ITables>

export type ITable = Table<string, IAttributes, IPrimaryKeys>

export type ITables = {
    [name : string] : ITable
}

export type EmptyTable<
    Name extends string,
> = Table<Name, {}, {}>

export type ExtendedTables<
    Tables extends ITables,
    Table_ extends ITable,
> = Tables & {
    [name in Table_[`name`]] : Table_
}

export type IAttribute = Attribute<string, Type>

export type IAttributes = {
    [name : string] : IAttribute
}

export type ExtendedAttributes<
    Attributes_ extends IAttributes,
    Attribute_ extends IAttribute,
> = Attributes_ & {
    [name in Attribute_[`name`]] : Attribute_
}

export type AttributeExtendedDatabaseTables<
    Database_ extends IDatabase,
    Table_ extends string & keyof Database_[`tables`],
    Attribute_ extends IAttribute
> = ExtendedTables<
    Database_[`tables`],
    Table<
        Table_,
        ExtendedAttributes<
            Database_[`tables`][Table_][`attributes`],
            Attribute_
        >,
        Database_[`tables`][Table_][`primary_keys`]
    >
>

export type IPrimaryKey = PrimaryKey<string, Type>

export type IPrimaryKeys = {
    [name : string] : IPrimaryKey
}

export type ExtendedPrimaryKeys<
    PrimaryKeys_ extends IPrimaryKeys,
    PrimaryKey_ extends IPrimaryKey,
> = PrimaryKeys_ & {
    [name in PrimaryKey_[`name`]] : PrimaryKey_
}

export type PrimaryKeyExtendedDatabaseTables<
    Database_ extends IDatabase,
    Table_ extends string & keyof Database_[`tables`],
    Attribute_ extends IAttribute
> = ExtendedTables<
    Database_[`tables`],
    Table<
        Table_,
        ExtendedAttributes<
            Database_[`tables`][Table_][`attributes`],
            Attribute_
        >,
        ExtendedPrimaryKeys<
            Database_[`tables`][Table_][`primary_keys`],
            PrimaryKey<Attribute_[`name`], Attribute_[`type`]>
        >
    >
>

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
    PrimaryKeys extends IPrimaryKeys,
> {
    public static readonly [type] : unique symbol = Symbol(`sql.Table`)

    public readonly name         : Name
    public readonly attributes   : Attributes
    public readonly primary_keys : PrimaryKeys

    public constructor({
        name,
        attributes,
        primary_keys,
    } : {
        name         : Name
        attributes   : Attributes
        primary_keys : PrimaryKeys
    }) {
        this.name         = name
        this.attributes   = attributes
        this.primary_keys = primary_keys
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
        Type_ extends Type,
    >(
        name : AttributeName,
        type : Type_,
    ) {
        const attribute = new Attribute({ name, type })
        const current_table = this.database.tables[this.current]
        const attributes = {
            ...current_table.attributes,
            [name] : attribute,
        }
        const table = new Table({
            name : current_table.name,
            attributes,
            primary_keys : current_table.primary_keys,
        })
        const tables = {
            ...this.database.tables,
            [this.current] : table,
        } as AttributeExtendedDatabaseTables<
            Database_, Name,
            Attribute<AttributeName, Type_>
        >
        const database = new Database({
            name : this.database.name as Database_[`name`],
            tables,
        })
        const builder = new TableBuilder({
            database,
            current : this.current,
        })

        return builder
    }
    public primary_key<
        AttributeName extends string,
        Type_ extends Type,
    >(
        name : AttributeName,
        type : Type_,
    ) {
        const attribute = new Attribute({ name, type })
        const primary_key = new PrimaryKey({ name, type })
        const current_table = this.database.tables[this.current]
        const attributes = {
            ...current_table.attributes,
            [name] : attribute,
        }
        const primary_keys = {
            ...current_table.primary_keys,
            [name] : primary_key,
        }
        const table = new Table({
            name : current_table.name,
            attributes,
            primary_keys,
        })
        const tables = {
            ...this.database.tables,
            [this.current] : table,
        } as PrimaryKeyExtendedDatabaseTables<
            Database_, Name,
            Attribute<AttributeName, Type_>
        >
        const database = new Database({
            name : this.database.name as Database_[`name`],
            tables,
        })
        const builder = new TableBuilder({
            database,
            current : this.current,
        })

        return builder
    }
}

export enum Type {
    Integer,
    Text,
}

export class Attribute<
    Name extends string,
    Type_ extends Type,
> {
    public static readonly [type] : unique symbol = Symbol(`sql.Attribute`)

    public readonly name : Name
    public readonly type : Type_

    public constructor({
        name,
        type,
    } : {
        name : Name
        type : Type_
    }) {
        this.name = name
        this.type = type
    }

    public get [type]() : typeof Attribute[typeof type] {
        return Attribute[type]
    }
}

export class PrimaryKey<
    Name extends string,
    Type_ extends Type,
> {
    public static readonly [type] : unique symbol = Symbol(`sql.PrimaryKey`)

    public readonly name : Name
    public readonly type : Type_

    public constructor({
        name,
        type,
    } : {
        name : Name
        type : Type_
    }) {
        this.name = name
        this.type = type
    }

    public get [type]() : typeof PrimaryKey[typeof type] {
        return PrimaryKey[type]
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
    const primary_keys = {} as const
    const table = new Table({ name, attributes, primary_keys })
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
