type AttributesOfTable<
    Name_ extends string
> = Readonly<{
    [name : string] : Attribute<Table<Name_, AttributesOfTable<Name_>>, typeof name>
}>

type TableWithAttribute<
    Name_ extends string,
> = Table<string, Readonly<{ [name in Name_] : Attribute<TableWithAttribute<Name_>, Name_> }>>

export class Database<
    Name_ extends string,
> {
    public static readonly symbol = Symbol(`sql.Database`)

    public readonly name : Name_

    public constructor({
        name,
    } : {
        name : Name_
    }) {
        this.name = name
    }

    public get symbol() : typeof Database.symbol {
        return Database.symbol
    }
}

export class Table<
    Name_ extends string,
    Attributes_ extends AttributesOfTable<Name_>,
> {
    public static readonly symbol = Symbol(`sql.Table`)

    public readonly name       : Name_
    public readonly attributes : Attributes_

    public constructor({
        name,
        attributes,
    } : {
        name       : Name_
        attributes : Attributes_
    }) {
        this.name       = name
        this.attributes = attributes
    }

    public get symbol() : typeof Table.symbol {
        return Table.symbol
    }
}

// @todo: add type, nullable
export class Attribute<
    Table_ extends TableWithAttribute<Name_>,
    Name_ extends string,
> {
    public static readonly symbol = Symbol(`sql.Attribute`)

    public readonly table : Table_
    public readonly name  : Name_

    public constructor({
        table,
        name,
    } : {
        table : Table_
        name  : Name_
    }) {
        this.table = table
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

function f<
    Att extends Attribute<Table<`my_table`, { [`my_att`] : Att }>, `my_att`>
>(
    att : Att,
) {
    const att_name : `my_att` = att.name
    const att_table_name : `my_table` = att.table.name
}
