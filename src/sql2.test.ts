import * as sql from './sql2'

test(`Smoke.`, () => {
    const db = sql.database(`MY_DATABASE`)

    const db_name : `MY_DATABASE` = db.name
})
