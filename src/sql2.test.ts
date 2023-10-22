import * as sql from './sql2'

test(`Smoke.`, () => {
    const db = sql.database(`FORUM`)
        .table(`User`)
        .table(`Session`)
        .end()

    const db_name                       : `FORUM`                 = db.name
    const user_table_symbol             : typeof sql.Table.symbol = db.tables.User.symbol
    const user_table_name               : `User`                  = db.tables.User.name
    const user_table_db_name            : `FORUM`                 = db.tables.User.database.name
    const user_table_session_table_name : `Session`               = db.tables.User.database.tables.Session.name
    const session_table_symbol          : typeof sql.Table.symbol = db.tables.Session.symbol
    const session_table_name            : `Session`               = db.tables.Session.name
    const session_table_db_name         : `FORUM`                 = db.tables.Session.database.name
    const session_table_user_table_name : `User`                  = db.tables.Session.database.tables.User.name
})
