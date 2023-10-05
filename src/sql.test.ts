import { database, connect } from './sql'

it(``, () => {
    const db = database(`forum`)
        .table(`User`)
            .primary_key(`id`, `serial`)
            .attribute(`login`, `text`)
            .attribute(`registered`, `timestamp`)
        .table(`Topic`)
            .primary_key(`id`, `serial`)
            .foreign_key(`author`, `User`, `id`)
            .attribute(`title`, `text`)
            .attribute(`content`, `text`)
            .attribute(`created`, `timestamp`)
        .table(`Post`)
            .primary_key(`id`, `serial`)
            .foreign_key(`author`, `User`, `id`)
            .attribute(`content`, `text`)
            .attribute(`created`, `timestamp`)

    // static checks
    db.name === `forum`
    db.tables.User.name === `User`
    db.tables.User.primary_keys.id.name === `id`
    db.tables.User.attributes.id.name === `id`
    db.tables.User.attributes.login.name === `login`
    db.tables.Topic.name === `Topic`
    db.tables.Topic.primary_keys.id.name === `id`
    db.tables.Topic.attributes.title.name === `title`
    db.tables.Topic.foreign_keys.author.table === `User`
    db.tables.Topic.foreign_keys.author.key === `id`

    expect(db.name).toBe(`forum`)
    expect(db.tables.User.name).toBe(`User`)
    expect(db.tables.User.primary_keys.id.name).toBe(`id`)
    expect(db.tables.User.attributes.id.name).toBe(`id`)
    expect(db.tables.User.attributes.login.name).toBe(`login`)
    expect(db.tables.Topic.name).toBe(`Topic`)
    expect(db.tables.Topic.primary_keys.id.name).toBe(`id`)
    expect(db.tables.Topic.attributes.title.name).toBe(`title`)
    expect(db.tables.Topic.foreign_keys.author.table).toBe(`User`)
    expect(db.tables.Topic.foreign_keys.author.key).toBe(`id`)

    const connection = connect(db)

    const query = connection
        .select(`Topic`, `author`)
        .select(`Topic`, `title`)
        .select(`User`, `id`)
        .where(db => db.Topic.author.equal(db.User.id))
        .end()

    expect(`${query}`).toBe(
        `SELECT Topic.author, Topic.title, User.id\n` +
        `FROM Topic, User\n` +
        `WHERE Topic.author == User.id;`
    )

    // query.selected[0].table === `Topic`
    // query.selected[0].attribute === `title`
    // query.selected[1].table === `User`
    // query.selected[1].attribute === `login`
})
