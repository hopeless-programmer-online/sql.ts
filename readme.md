# SQL.ts

## Quick start

- Install [prerequisites](#prerequisites).
- Install `sql.ts` package with `npm install https://github.com/hopeless-programmer-online/sql.ts.git#development`.
- See [examples](#examples)

## Examples

```ts
import * as sql from 'sql.ts'

async function main() {
    const db = sql.database(`MY_DATABASE`)
        .table(`User`)
            .primary_key(`id`, sql.Type.Integer)
            .attribute(`name`, sql.Type.Text)
        .table(`Message`)
            .primary_key(`id`, sql.Type.Integer)
            .foreign_key(`author_id`, `User`, `id`)
            .attribute(`text`, sql.Type.Text)
        .end()

    const connection = await db.connect(`:memory:`)

    connection.tables.User.insert({
        id : 1,
        name : `John`,
    })
    connection.tables.Message.insert({
        id : 1,
        author_id : 1,
        text : `lorem ipsum`,
    })

    console.log(await connection.tables.User.size)

    const rows = await connection
        .select(`User`, `id`)
        .select(`Message`, `text`)
        .where(x => x.User.id.equals(x.Message.author_id))
        .run()

    console.log(rows)
    console.log(`done`)
}

main()
```

## Prerequisites

- [Node.js 14+](https://nodejs.org/en/download).
- [Git 2.0+](https://git-scm.com/downloads).
