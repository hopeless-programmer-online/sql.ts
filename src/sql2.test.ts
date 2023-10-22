import * as sql from './sql2'

test(`Smoke.`, () => {
    const db = sql.database(`FORUM`)
        .table(`User`)
        .end()

    const db_name : `FORUM` = db.name
    const user_table_name : `User` = db.tables.User.name
    const user_table_db_name : `FORUM` = db.tables.User.database.name
})
