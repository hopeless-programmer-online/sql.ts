import * as sql from './sql'

test(``, () => {
    const db = sql.database(`MY_DATABASE`)

    // static checks
    const database_name : `MY_DATABASE` = db.name

    expect(db[sql.type]).toBe(sql.Database[sql.type])
    expect(db.name).toBe(`MY_DATABASE`)
})
