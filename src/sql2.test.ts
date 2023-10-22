import * as sql from './sql2'

test(`Smoke.`, () => {
    const db = sql.database(`MY_DATABASE`)
        .end()

    const db_name : `MY_DATABASE` = db.name
})
