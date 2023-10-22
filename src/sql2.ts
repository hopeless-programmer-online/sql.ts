type IDatabase = Database<string, TablesOfDatabase<string>>

type TablesOfDatabase<
    Name_ extends string
> = Readonly<{
    [name : string] : Table<Database<Name_, TablesOfDatabase<Name_>>, typeof name>
}>

type DatabaseWithTable<
    Name_ extends string,
> = Database<string, Readonly<{ [name in Name_] : Table<DatabaseWithTable<Name_>, Name_> }>>

type TableExtendedDatabase<
    Database_ extends IDatabase,
    Name_ extends string,
> = Database<
    Database_[`name`],
    { [table in Database_[`tables`][keyof Database_[`tables`]] as table[`name`]] : Table<
        TableExtendedDatabase<Database_, Name_> & DatabaseWithTable<table[`name`]>,
        table[`name`]
    > } &
    { [name in Name_] : Table<
        TableExtendedDatabase<Database_, Name_> & DatabaseWithTable<name>,
        name
    > }
>

// type AttributesOfTable<
//     Name_ extends string
// > = Readonly<{
//     [name : string] : Attribute<Table<Name_, AttributesOfTable<Name_>>, typeof name>
// }>

// type TableWithAttribute<
//     Name_ extends string,
// > = Table<string, Readonly<{ [name in Name_] : Attribute<TableWithAttribute<Name_>, Name_> }>>

export class Database<
    Name_   extends string,
    Tables_ extends TablesOfDatabase<Name_>,
> {
    public static readonly symbol = Symbol(`sql.Database`)

    public readonly name   : Name_
    public readonly tables : Tables_

    public constructor({
        name,
        tables,
    } : {
        name   : Name_
        tables : Tables_
    }) {
        this.name   = name
        this.tables = tables
    }

    public get symbol() : typeof Database.symbol {
        return Database.symbol
    }
}

export class Table<
    Database_ extends DatabaseWithTable<Name_>,
    Name_     extends string,
    // Attributes_ extends AttributesOfTable<Name_>,
> {
    public static readonly symbol = Symbol(`sql.Table`)

    private _database : Database_ | null = null

    public readonly name     : Name_
    // public readonly attributes : Attributes_

    public constructor({
        name,
        // attributes,
    } : {
        name : Name_
        // attributes : Attributes_
    }) {
        this.name = name
        // this.attributes = attributes
    }

    public get symbol() : typeof Table.symbol {
        return Table.symbol
    }
    public get database() {
        const { _database } = this

        if (!_database) throw new Error // @todo

        return _database
    }
    /** @private */
    public set database(database : Database_) {
        if (this._database) throw new Error // @todo

        this._database = database
    }
}

// @todo: add type, nullable
export class Attribute<
    // Table_ extends TableWithAttribute<Name_>,
    Name_ extends string,
> {
    public static readonly symbol = Symbol(`sql.Attribute`)

    // public readonly table : Table_
    public readonly name  : Name_

    public constructor({
        // table,
        name,
    } : {
        // table : Table_
        name  : Name_
    }) {
        // this.table = table
        this.name  = name
    }

    public get symbol() : typeof Attribute.symbol {
        return Attribute.symbol
    }
}

export enum Type {
    Integer,
    Text,
}

class DatabaseBuilder<
    Database_ extends IDatabase,
> {
    public readonly database : Database_

    public constructor({
        database,
    } : {
        database : Database_
    }) {
        this.database = database
    }

    public table<Name_ extends string>(name : Name_) {
        const database = extend_tables(this.database, name)

        return new TableBuilder({
            database,
            current : name,
        })
    }
    public end() {
        return this.database
    }
}

class TableBuilder<
    Database_ extends IDatabase,
    Current_  extends string & keyof Database_[`tables`],
> {
    public readonly database : Database_
    public readonly current  : Current_

    public constructor({
        database,
        current,
    } : {
        database : Database_
        current  : Current_
    }) {
        this.database = database
        this.current  = current
    }

    public table<Name_ extends string>(name : Name_) {
        const database = extend_tables(this.database, name)

        return new TableBuilder({
            database,
            current : name,
        })
    }
    public end() {
        return this.database
    }
}

function extend_tables<
    Database_ extends IDatabase,
    Name_ extends string,
>(
    database : Database_,
    name : Name_,
) {
    const table = new Table({
        name,
    })
    const tables = {
        ...Object.fromEntries(
            Object.entries(database.tables)
                .map(([ name, table ]) =>
                    [ name, new Table({ name : table.name }) ]
                )
        ),
        [name] : table,
    }

    return new Database({
        name : database.name,
        tables,
    }) as TableExtendedDatabase<Database_, Name_>
}

export function database<
    Name_ extends string,
>(
    name : Name_,
) {
    const tables = {} as const
    const database = new Database({ name, tables })

    return new DatabaseBuilder({ database })
}
