import * as sql from './sql'

test(`Empty database`, () => {
    const db = sql.database(`MY_DATABASE`)

    // static checks
    const database_name : `MY_DATABASE` = db.name
    const database_tables : {} = db.tables

    expect(db[sql.type]).toBe(sql.Database[sql.type])
    expect(database_name).toBe(`MY_DATABASE`)
    expect(database_tables).toMatchObject({})
})
