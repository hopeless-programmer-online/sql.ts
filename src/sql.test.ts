import * as sql from './sql'

test(`Smoke.`, () => {
    const db = sql.database(`FORUM`)
        .table(`User`)
        .table(`Topic`)
        .table(`Post`)
        .end()

    // static checks
    const database_type : typeof sql.Database[typeof sql.type] = db[sql.type]
    const database_name : `FORUM` = db.name
    const database_tables : {
        User : { name : `User` }
        Topic : { name : `Topic` }
        Post : { name : `Post` }
    } = db.tables

    expect(database_type).toBe(sql.Database[sql.type])
    expect(database_name).toBe(`FORUM`)
    expect(database_tables).toMatchObject({})
})
