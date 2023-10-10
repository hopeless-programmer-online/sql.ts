export const type = Symbol(`sql.type`)

export type IDatabase = Database<string, ITables>

export type ITable = Table<string, IAttributes, IPrimaryKeys, IForeignKeys>

export type ITables = {
    [name : string] : ITable
}

export type EmptyTable<
    Name extends string,
> = Table<Name, {}, {}, {}>

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
        Database_[`tables`][Table_][`primary_keys`],
        Database_[`tables`][Table_][`foreign_keys`]
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
        >,
        Database_[`tables`][Table_][`foreign_keys`]
    >
>

export type IForeignKey = ForeignKey<string, string, string>

export type IForeignKeys = {
    [name : string] : IForeignKey
}

export type ExtendedForeignKeys<
    ForeignKeys_ extends IForeignKeys,
    ForeignKey_ extends IForeignKey,
> = ForeignKeys_ & {
    [name in ForeignKey_[`name`]] : ForeignKey_
}

export type ForeignKeyExtendedDatabaseTables<
    Database_ extends IDatabase,
    Current_ extends string & keyof Database_[`tables`],
    Name_ extends string,
    Table_ extends string & keyof Database_[`tables`],
    Attribute_ extends string & keyof Database_[`tables`][Table_][`primary_keys`]
> = ExtendedTables<
    Database_[`tables`],
    Table<
        Current_,
        ExtendedAttributes<
            Database_[`tables`][Current_][`attributes`],
            Attribute<Name_, Database_[`tables`][Table_][`primary_keys`][Attribute_][`type`]>
        >,
        Database_[`tables`][Current_][`primary_keys`],
        ExtendedForeignKeys<
            Database_[`tables`][Current_][`foreign_keys`],
            ForeignKey<Name_, Table_, Attribute_>
        >
    >
>

export type IConnection = Connection<IDatabase>

export type ISelection = Selection<string, string>

export type IAttributeExpression<
    Type_ extends Type,
> = AttributeExpression<Type_, string, string>

export type SimpleExpression<
    Type_ extends Type,
> = IAttributeExpression<Type_>

export type IEqualsExpression<
    Type_ extends Type,
> = EqualsExpression<Type_, Expression<Type_>, Expression<Type_>>

export type BooleanExpression<
    Type_ extends Type,
> = IEqualsExpression<Type_>

export type Expression<
    Type_ extends Type,
> = SimpleExpression<Type_> | BooleanExpression<Type_>

export type DatabaseWhereProxy<
    Database_ extends IDatabase
> = {
    [table in Database_[`tables`][keyof Database_[`tables`]] as table[`name`]] : TableWhereProxy<table>
}

export type TableWhereProxy<
    Table_ extends ITable,
> = {
    [attribute in Table_[`attributes`][keyof Table_[`attributes`]] as attribute[`name`]] : AttributeExpression<
        attribute[`type`],
        Table_[`name`],
        attribute[`name`]
    >
}

export type WhereFilter<
    Database_ extends IDatabase,
> = (
    proxy : DatabaseWhereProxy<Database_>
) => BooleanExpression<Type>

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

    public connect(path : string) : Connection<Database<Name, Tables>> {
        const connection = new Connection({ database : this })

        return connection
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
    ForeignKeys extends IForeignKeys,
> {
    public static readonly [type] : unique symbol = Symbol(`sql.Table`)

    public readonly name         : Name
    public readonly attributes   : Attributes
    public readonly primary_keys : PrimaryKeys
    public readonly foreign_keys : ForeignKeys

    public constructor({
        name,
        attributes,
        primary_keys,
        foreign_keys,
    } : {
        name         : Name
        attributes   : Attributes
        primary_keys : PrimaryKeys
        foreign_keys : ForeignKeys
    }) {
        this.name         = name
        this.attributes   = attributes
        this.primary_keys = primary_keys
        this.foreign_keys = foreign_keys
    }

    public get [type]() : typeof Table[typeof type] {
        return Table[type]
    }
}

export class TableBuilder<
    Database_ extends IDatabase,
    Current_ extends string & keyof Database_[`tables`],
> {
    public static readonly [type] : unique symbol = Symbol(`sql.DatabaseBuilder`)

    public readonly database : Database_
    public readonly current : Current_

    public constructor({
        database,
        current,
    } : {
        database : Database_
        current : Current_
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
            foreign_keys : current_table.foreign_keys,
        })
        const tables = {
            ...this.database.tables,
            [this.current] : table,
        } as AttributeExtendedDatabaseTables<
            Database_, Current_,
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
            foreign_keys : current_table.foreign_keys,
        })
        const tables = {
            ...this.database.tables,
            [this.current] : table,
        } as PrimaryKeyExtendedDatabaseTables<
            Database_, Current_,
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
    public foreign_key<
        AttributeName extends string,
        Table_ extends string & keyof Database_[`tables`],
        PrimaryKey_ extends string & keyof Database_[`tables`][Table_][`primary_keys`],
    >(
        name : AttributeName,
        table : Table_,
        attribute : PrimaryKey_,
    ) {
        const { type } = this.database.tables[table].attributes[attribute]
        const attribute_ = new Attribute({ name, type })
        const foreign_key = new ForeignKey({ name, table, attribute })
        const current_table = this.database.tables[this.current]
        const attributes = {
            ...current_table.attributes,
            [name] : attribute_,
        }
        const foreign_keys = {
            ...current_table.foreign_keys,
            [name] : foreign_key,
        }
        const table_ = new Table({
            name : current_table.name,
            attributes,
            primary_keys : current_table.primary_keys,
            foreign_keys,
        })
        const tables = {
            ...this.database.tables,
            [this.current] : table_,
        } as ForeignKeyExtendedDatabaseTables<Database_, Current_, AttributeName, Table_, PrimaryKey_>
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

export class ForeignKey<
    Name extends string,
    Table_ extends string,
    Attribute_ extends string
> {
    public static readonly [type] : unique symbol = Symbol(`sql.ForeignKey`)

    public readonly name      : Name
    public readonly table     : Table_
    public readonly attribute : Attribute_

    public constructor({
        name,
        table,
        attribute,
    } : {
        name      : Name
        table     : Table_
        attribute : Attribute_
    }) {
        this.name      = name
        this.table     = table
        this.attribute = attribute
    }

    public get [type]() : typeof ForeignKey[typeof type] {
        return ForeignKey[type]
    }
}

export class Connection<
    Database_ extends IDatabase,
> {
    public static readonly [type] : unique symbol = Symbol(`sql.Connection`)

    public readonly database : Database_

    public constructor({
        database,
    } : {
        database : Database_
    }) {
        this.database = database
    }

    public get [type]() : typeof Connection[typeof type] {
        return Connection[type]
    }

    public select<
        Table_ extends string & keyof Database_[`tables`],
        Attribute_ extends string & keyof Database_[`tables`][Table_][`attributes`],
    >(
        table : Table_,
        attribute : Attribute_,
    ) : SelectionQuery<Connection<Database_>, [ Selection<Table_, Attribute_> ]> {
        const selected = [
            new Selection({ table, attribute }),
        ] as [ Selection<Table_, Attribute_> ]
        const query = new SelectionQuery({
            connection : this,
            selected,
        })

        return query
    }
}

export class Selection<
    Table_ extends string,
    Attribute_ extends string,
> {
    public static readonly [type] : unique symbol = Symbol(`sql.Selection`)

    public readonly table     : Table_
    public readonly attribute : Attribute_

    public constructor({
        table,
        attribute,
    } : {
        table     : Table_
        attribute : Attribute_
    }) {
        this.table     = table
        this.attribute = attribute
    }

    public get [type]() : typeof Selection[typeof type] {
        return Selection[type]
    }
}

export class SelectionQuery<
    Connection_ extends IConnection,
    Selected extends ISelection[],
> {
    public static readonly [type] : unique symbol = Symbol(`sql.SelectionQuery`)

    public readonly connection : Connection_
    public readonly selected   : Selected

    public constructor({
        connection,
        selected,
    } : {
        connection : Connection_
        selected   : Selected
    }) {
        this.connection = connection
        this.selected   = selected
    }

    public get [type]() : typeof SelectionQuery[typeof type] {
        return SelectionQuery[type]
    }

    public select<
        Table_ extends string & keyof Connection_[`database`][`tables`],
        Attribute_ extends string & keyof Connection_[`database`][`tables`][Table_][`attributes`],
    >(
        table : Table_,
        attribute : Attribute_,
    ) : SelectionQuery<Connection<Connection_[`database`]>, [ ...Selected, Selection<Table_, Attribute_> ]> {
        const selected = [
            ...this.selected,
            new Selection({ table, attribute }),
        ] as [ ...Selected, Selection<Table_, Attribute_> ]
        const query = new SelectionQuery({
            connection : this.connection,
            selected,
        })

        return query
    }
    public where(filter : WhereFilter<Connection_[`database`]>) : FilterQuery<
        Connection_,
        Selected,
        BooleanExpression<Type>
    > {
        const { connection, selected } = this
        const proxy = Object.fromEntries(
            Object.entries(connection.database.tables)
            .map(([ table, { attributes } ]) => [
                table, Object.fromEntries(
                    Object.entries(attributes)
                    .map(([ attribute, { type } ]) => [
                        attribute, new AttributeExpression({
                            type,
                            attribute,
                            table,
                        })
                    ])
                )
            ])
        ) as DatabaseWhereProxy<Connection_[`database`]>
        const expression = filter(proxy)
        const query = new FilterQuery({
            connection,
            selected,
            expression,
        })

        return query
    }
}

export class AttributeExpression<
    Type_ extends Type,
    Table_ extends string,
    Attribute_ extends string,
> {
    public static readonly [type] : unique symbol = Symbol(`sql.AttributeExpression`)

    public readonly type      : Type_
    public readonly table     : Table_
    public readonly attribute : Attribute_

    public constructor({
        type,
        table,
        attribute,
    } : {
        type      : Type_
        table     : Table_
        attribute : Attribute_
    }) {
        this.type      = type
        this.table     = table
        this.attribute = attribute
    }

    public get [type]() : typeof AttributeExpression[typeof type] {
        return AttributeExpression[type]
    }

    public equals<
        Right extends Expression<Type_>,
    >(
        right : Right,
    ) : EqualsExpression<
        Type_,
        AttributeExpression<Type_, Table_, Attribute_>,
        Right
    > {
        return new EqualsExpression({
            left : this,
            right,
        })
    }

    public toString() {
        return `${this.table}.${this.attribute}`
    }
}

export class EqualsExpression<
    Type_ extends Type,
    Left extends Expression<Type_>,
    Right extends Expression<Type_>,
> {
    public static readonly [type] : unique symbol = Symbol(`sql.EqualsExpression`)

    public readonly left  : Left
    public readonly right : Right

    public constructor({
        left,
        right,
    } : {
        left  : Left
        right : Right
    }) {
        this.left  = left
        this.right = right
    }

    public get [type]() : typeof EqualsExpression[typeof type] {
        return EqualsExpression[type]
    }

    public toString() {
        return `${this.left} = ${this.right}`
    }
}

export class FilterQuery<
    Connection_ extends IConnection,
    Selected extends ISelection[],
    Expression_ extends BooleanExpression<Type>,
> {
    public static readonly [type] : unique symbol = Symbol(`sql.FilterQuery`)

    public readonly connection : Connection_
    public readonly selected   : Selected
    public readonly expression : Expression_

    public constructor({
        connection,
        selected,
        expression,
    } : {
        connection : Connection_
        selected   : Selected
        expression : Expression_
    }) {
        this.connection = connection
        this.selected   = selected
        this.expression = expression
    }

    public get [type]() : typeof FilterQuery[typeof type] {
        return FilterQuery[type]
    }

    public toString() {
        const columns = this.selected
            .map(x => `${x.table}.${x.attribute}`)
            .join(`, `)
        const tables = this.selected
            .reduce<string[]>((a, x) => a.includes(x.table) ? a : [ ...a, x.table ], [])
            .join(`, `)
        const text = (
            `SELECT ${columns}\n` +
            `FROM ${tables}\n` +
            `WHERE ${this.expression}`
        )

        return text
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
    const foreign_keys = {} as const
    const table = new Table({ name, attributes, primary_keys, foreign_keys })
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
