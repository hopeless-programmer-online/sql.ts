export {}

type IDatabase = Database<string, ITables>

type EmptyDatabase<Name extends string> = Database<Name, {}>

type Database<Name extends string, Tables extends ITables> = {
    type : `database`
    name : Name
    tables : Tables
    table : TableExtender
}

type TableExtended<Database_ extends IDatabase, Name extends string> = WorkingTable<Database<
    Database_[`name`],
    ExtendedTables<Database_[`tables`], EmptyTable<Name>>
>, Name>

type TableExtender = <Database extends IDatabase, Name extends string>(this : Database, name : Name) => TableExtended<Database, Name>

type AttributeExtended<WorkingTable_ extends IWorkingTable, Name extends string, DataType_ extends DataType> = WorkingTable<Database<
    WorkingTable_[`name`],
    ExtendedTablesAttributes<WorkingTable_[`tables`], WorkingTable_[`_table`], Name, DataType_>
>, WorkingTable_[`_table`]>

type AttributeExtender = <WorkingTable_ extends IWorkingTable, Name extends string, DataType_ extends DataType>(this : WorkingTable_, name : Name, data_type : DataType_) => AttributeExtended<WorkingTable_, Name, DataType_>

type PrimaryKeyExtended<WorkingTable_ extends IWorkingTable, Name extends string, DataType_ extends DataType> = WorkingTable<Database<
    WorkingTable_[`name`],
    ExtendedTablesPrimaryKeys<WorkingTable_[`tables`], WorkingTable_[`_table`], Name, DataType_>
>, WorkingTable_[`_table`]>

type PrimaryKeyExtender = <WorkingTable_ extends IWorkingTable, Name extends string, DataType_ extends DataType>(this : WorkingTable_, name : Name, data_type : DataType_) => PrimaryKeyExtended<WorkingTable_, Name, DataType_>

type ForeignKeyExtended<
    WorkingTable_ extends IWorkingTable,
    Name extends string,
    SourceTable extends string & keyof WorkingTable_[`tables`],
    Key extends string & keyof WorkingTable_[`tables`][SourceTable][`primary_keys`],
> = WorkingTable<Database<
    WorkingTable_[`name`],
    ExtendedTablesForeignKeys<WorkingTable_[`tables`], WorkingTable_[`_table`], Name, SourceTable, Key>
>, WorkingTable_[`_table`]>

type ForeignKeyExtender = <
    WorkingTable_ extends IWorkingTable,
    Name extends string,
    SourceTable extends string & keyof WorkingTable_[`tables`],
    Key extends string & keyof WorkingTable_[`tables`][SourceTable][`primary_keys`]
>(
    this : WorkingTable_,
    name : Name,
    table : SourceTable,
    key : Key,
) => ForeignKeyExtended<WorkingTable_, Name, SourceTable, Key>

type ITable = Table<string, IAttributes, IPrimaryKeys, IForeignKeys>

type EmptyTable<Name extends string> = Table<Name, {}, {}, {}>

type Table<Name extends string, Attributes extends IAttributes, PrimaryKeys extends IPrimaryKeys, ForeignKeys extends IForeignKeys> = {
    type : `table`
    name : Name
    attributes : Attributes
    primary_keys : PrimaryKeys
    foreign_keys : ForeignKeys
}

type IWorkingTable = WorkingTable<IDatabase, string>

type WorkingTable<Database extends IDatabase, Name extends keyof Database[`tables`]> = Database & {
    _table : Name
    attribute : AttributeExtender
    primary_key : PrimaryKeyExtender
    foreign_key : ForeignKeyExtender
}

type ExtendedTables<Tables extends ITables, Table extends ITable> = Tables & {
    [name in Table[`name`]] : Table
}

type ExtendedTablesAttributes<Tables extends ITables, Table_ extends (string & keyof Tables), Name extends string, DataType_ extends DataType> = ExtendedTables<
    Tables,
    Table<
        Table_,
        ExtendedAttributes<
            Tables[Table_][`attributes`],
            Attribute<Name, DataType_>
        >,
        Tables[Table_][`primary_keys`],
        Tables[Table_][`foreign_keys`]
    >
>

type ExtendedTablesPrimaryKeys<Tables extends ITables, Table_ extends (string & keyof Tables), Name extends string, DataType_ extends DataType> = ExtendedTables<
    Tables,
    Table<
        Table_,
        ExtendedAttributes<
            Tables[Table_][`attributes`],
            Attribute<Name, DataType_>
        >,
        ExtendedPrimaryKeys<
            Tables[Table_][`primary_keys`],
            PrimaryKey<Name, DataType_>
        >,
        Tables[Table_][`foreign_keys`]
    >
>

type ExtendedTablesForeignKeys<
    Tables extends ITables,
    Table_ extends (string & keyof Tables),
    Name extends string,
    SourceTable extends string & keyof Tables,
    Key extends string & keyof Tables[SourceTable][`primary_keys`]
> = ExtendedTables<
    Tables,
    Table<
        Table_,
        ExtendedAttributes<
            Tables[Table_][`attributes`],
            Attribute<Name, Tables[SourceTable][`attributes`][Key][`data_type`]>
        >,
        Tables[Table_][`primary_keys`],
        ExtendedForeignKeys<
            Tables[Table_][`foreign_keys`],
            ForeignKey<Name, SourceTable, Key>
        >
    >
>

type ITables = {
    [name : string] : ITable
}

type DataType = `text` | `date` | `serial` | `timestamp`

type IAttribute = Attribute<string, DataType>

type Attribute<Name extends string, DataType_ extends DataType> = {
    type      : `attribute`
    name      : Name
    data_type : DataType_
}

type ExtendedAttributes<Attributes extends IAttributes, Attribute extends IAttribute> = Attributes & {
    [name in Attribute[`name`]] : Attribute
}

type IAttributes = {
    [name : string] : IAttribute
}

type IPrimaryKey = PrimaryKey<string, DataType>

type PrimaryKey<Name extends string, DataType_ extends DataType> = {
    type      : `primary_key`
    name      : Name
    data_type : DataType_
}

type ExtendedPrimaryKeys<PrimaryKeys extends IPrimaryKeys, PrimaryKey extends IPrimaryKey> = PrimaryKeys & {
    [name in PrimaryKey[`name`]] : PrimaryKey
}

type IPrimaryKeys = {
    [name : string] : IPrimaryKey
}

type IForeignKey = ForeignKey<string, string, string>

type ForeignKey<Name extends string, SourceTable extends string, Key extends string> = {
    type  : `foreign_key`
    name  : Name
    table : SourceTable
    key   : Key
}

type ExtendedForeignKeys<ForeignKeys extends IForeignKeys, ForeignKey extends IForeignKey> = ForeignKeys & {
    [name in ForeignKey[`name`]] : ForeignKey
}

type IForeignKeys = {
    [name : string] : IForeignKey
}

type ISelected = Selected<string, string>

type Selected<Table extends string, Attribute extends string> = {
    table : Table
    attribute : Attribute
}

type ISelector = Selector<IDatabase, ISelected[]>

type Selector<Database_ extends IDatabase, Selected_ extends ISelected[]> = {
    database : Database_
    selected : Readonly<[...Selected_]>
    select : SelectorExtender
    where : Filter
}

type SelectorExtender = <
    Selector_ extends ISelector,
    Table extends string & keyof Selector_[`database`][`tables`],
    Attribute extends string & keyof Selector_[`database`][`tables`][Table][`attributes`],
>(
    this : Selector_,
    table : Table,
    attribute : Attribute,
) => Selector<Selector_[`database`], [ ...Selector_[`selected`], Selected<Table, Attribute> ]>

export function database<Name extends string>(name : Name) : EmptyDatabase<Name> {
    return {
        type : `database`,
        name,
        tables : {},
        table,
    }
}

function table<Database extends IDatabase, Name extends string>(this : Database, name : Name) : TableExtended<Database, Name> {
    return {
        ...this,
        tables : {
            ...this.tables,
            [name] : {
                type : `table`,
                name : name,
                attributes : {},
                primary_keys : {},
            },
        } as unknown as ExtendedTables<Database[`tables`], EmptyTable<Name>>,
        _table : name,
        attribute,
        primary_key,
        foreign_key,
    }
}

function attribute<WorkingTable_ extends IWorkingTable, Name extends string, DataType_ extends DataType>(this : WorkingTable_, name : Name, data_type : DataType_) : AttributeExtended<WorkingTable_, Name, DataType_> {
    return {
        ...this,
        tables : {
            ...this.tables,
            [this._table] : {
                ...this.tables[this._table],
                attributes : {
                    ...this.tables[this._table].attributes,
                    [name] : {
                        type : `attribute`,
                        name,
                        data_type,
                    },
                },
            },
        } as unknown as ExtendedTablesAttributes<WorkingTable_[`tables`], WorkingTable_[`_table`], Name, DataType_>,
    }
}

function primary_key<WorkingTable_ extends IWorkingTable, Name extends string, DataType_ extends DataType>(this : WorkingTable_, name : Name, data_type : DataType_) : PrimaryKeyExtended<WorkingTable_, Name, DataType_> {
    return {
        ...this,
        tables : {
            ...this.tables,
            [this._table] : {
                ...this.tables[this._table],
                attributes : {
                    ...this.tables[this._table].attributes,
                    [name] : {
                        type : `attribute`,
                        name,
                        data_type,
                    },
                },
                primary_keys : {
                    ...this.tables[this._table].primary_keys,
                    [name] : {
                        type : `primary_key`,
                        name,
                        data_type,
                    },
                },
            },
        } as unknown as ExtendedTablesPrimaryKeys<WorkingTable_[`tables`], WorkingTable_[`_table`], Name, DataType_>,
    }
}

function foreign_key<
    WorkingTable_ extends IWorkingTable,
    Name extends string,
    SourceTable extends string & keyof WorkingTable_[`tables`],
    Key extends string & keyof WorkingTable_[`tables`][SourceTable][`primary_keys`],
>(
    this : WorkingTable_,
    name : Name,
    table : string & keyof WorkingTable_[`tables`],
    key : Key,
) : ForeignKeyExtended<WorkingTable_, Name, SourceTable, Key> {
    return {
        ...this,
        tables : {
            ...this.tables,
            [this._table] : {
                ...this.tables[this._table],
                attributes : {
                    ...this.tables[this._table].attributes,
                    [name] : {
                        type : `attribute`,
                        name,
                        data_type : this.tables[table].attributes[key].data_type,
                    },
                },
                foreign_keys : {
                    ...this.tables[this._table].foreign_keys,
                    [name] : {
                        type : `foreign_key`,
                        name,
                        table,
                        key,
                    },
                },
            },
        } as unknown as ExtendedTablesForeignKeys<WorkingTable_[`tables`], WorkingTable_[`_table`], Name, SourceTable, Key>,
    }
}

export function connect<Database_ extends IDatabase>(database : Database_) {
    const selected = [] as const

    return {
        database,
        selected,
        select,
        where,
    }
}

function select<
    Selector_ extends ISelector,
    Table extends string & keyof Selector_[`database`][`tables`],
    Attribute extends string & keyof Selector_[`database`][`tables`][Table][`attributes`],
>(
    this : Selector_,
    table : Table,
    attribute : Attribute,
) : Selector<Selector_[`database`], [ ...Selector_[`selected`], Selected<Table, Attribute> ]> {
    const selected = [ ...this.selected, { table, attribute } ] as const

    return {
        ...this,
        selected,
        where,
    } as unknown as Selector<Selector_[`database`], [ ...Selector_[`selected`], Selected<Table, Attribute> ]>
}

type IConstantExpression = ConstantExpression<string | number>

type ConstantExpression<Type extends string | number> = {
    type : `constant`
    value : Type
}

type IAttributeExpression = AttributeExpression<string, string>

type AttributeExpression<Table extends string, Attribute extends string> = {
    type : `attribute`
    table : Table
    attribute : Attribute
    equal : EqualExpressionFilter
}

type IEqualExpression = EqualExpression<IExpression, IExpression>

interface EqualExpression<Left extends IExpression, Right extends IExpression> {
    type : `equal`
    left : Left
    right : Right
}

type EqualExpressionFilter = <
    Attribute extends IAttributeExpression,
    Right extends IExpression | number | string,
>(
    this : Attribute,
    right : Right,
) =>  IExpression /*EqualExpression<
    AttributeExpression<Selected_[`table`], Selected_[`attribute`]>,
    Right extends number | string ? ConstantExpression<Right> : Right
>*/

type IExpression =
    | IConstantExpression
    | IAttributeExpression
    | IEqualExpression

function equal<
    Attribute extends IAttributeExpression,
    Right extends IExpression,
>(
    this : Attribute,
    right : Right | number | string,
) : IExpression /* EqualExpression<
    AttributeExpression<Selected_[`table`], Selected_[`attribute`]>,
    Right extends number | string ? ConstantExpression<Right> : Right
> */ {
    const right1 = typeof right === `number` || typeof right === `string`
        ? { type : `constant`, value : right } as const
        : right

    return {
        type : `equal`,
        left : this,
        right : right1,
    }
}

type DatabaseFilter<
    Selector_ extends ISelector,
> = {
    [table_name in string & keyof Selector_[`database`][`tables`]] : {
        [attribute_name in string & keyof Selector_[`database`][`tables`][table_name][`attributes`]] : AttributeExpression<table_name, attribute_name>
    }
    // [table in Selector_[`selected`][number] as table[`table`] ] : {
    //     [attribute in table[`attribute`]] : AttributeExpression<table[`table`], attribute>
    // }
}

type Filter = <
    Selector_ extends ISelector,
>(
    this : Selector_,
    filter : (database : DatabaseFilter<Selector_>) => IExpression,
) => {
    expression : IExpression
    end : () => {
        toString : () => string
    }
}

function where<
    Selector_ extends ISelector,
>(
    this : Selector_,
    filter : (database : DatabaseFilter<Selector_>) => IExpression,
) {
    // this.database.tables.reduce((tables, table) => {
    //     return {
    //         ...tables,
    //     }
    // }, {})

    const database_filter = Object.fromEntries(Object.entries(this.database.tables)
        .map(([ table_name, table ]) => [ table_name, Object.fromEntries(Object.entries(table.attributes)
            .map(([ name, attribute ]) => [ name, {
                type : `attribute` as const,
                table : table_name,
                attribute : name,
                equal,
            } as const ])
        ) ])
    ) as DatabaseFilter<Selector_>

    const expression = filter(database_filter)

    const toString = () => {
        const stringify_expression = (expression : IExpression) : string => {
            if (expression.type === `constant`) return `${expression.value}`
            else if (expression.type === `attribute`) return `${expression.table}.${expression.attribute}`
            else if (expression.type === `equal`) return `${stringify_expression(expression.left)} == ${stringify_expression(expression.right)}`
            else ((never : never) => { throw new Error })(expression) // @todo
        }

        return (
            `SELECT ${this.selected.map(x => `${x.table}.${x.attribute}`).join(`, `)}\n` +
            `FROM ${this.selected.reduce<string[]>((a, x) => a.includes(x.table) ? a : [ ...a, x.table ], []).join(`, `)}\n` +
            `WHERE ${stringify_expression(expression)};`
        )
    }

    return {
        expression,
        end : () => ({
            toString,
        }),
    }
}
