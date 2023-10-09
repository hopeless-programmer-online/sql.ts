import * as sql from './sql'

test(`Smoke.`, () => {
    const db = sql.database(`FORUM`)
        .table(`User`)
            .attribute(`id`)
            .attribute(`login`)
        .table(`Topic`)
            .attribute(`id`)
            .attribute(`author_id`)
            .attribute(`caption`)
            .attribute(`text`)
        .table(`Post`)
            .attribute(`id`)
            .attribute(`author_id`)
            .attribute(`text`)
        .end()

    // static checks
    const database_type : typeof sql.Database[typeof sql.type] = db[sql.type]
    const database_name : `FORUM`                              = db.name

    expect(database_type).toBe(sql.Database[sql.type])
    expect(database_name).toBe(`FORUM`)

    const user_table_name                 : `User`  = db.tables.User.name
    const user_table_id_attribute_name    : `id`    = db.tables.User.attributes.id.name
    const user_table_login_attribute_name : `login` = db.tables.User.attributes.login.name

    expect(user_table_name).toBe(`User`)
    expect(user_table_id_attribute_name).toBe(`id`)
    expect(user_table_login_attribute_name).toBe(`login`)

    const topic_table_name                     : `Topic`     = db.tables.Topic.name
    const topic_table_id_attribute_name        : `id`        = db.tables.Topic.attributes.id.name
    const topic_table_author_id_attribute_name : `author_id` = db.tables.Topic.attributes.author_id.name
    const topic_table_caption_attribute_name   : `caption`   = db.tables.Topic.attributes.caption.name
    const topic_table_text_attribute_name      : `text`      = db.tables.Topic.attributes.text.name

    expect(topic_table_name).toBe(`Topic`)
    expect(topic_table_id_attribute_name).toBe(`id`)
    expect(topic_table_author_id_attribute_name).toBe(`author_id`)
    expect(topic_table_caption_attribute_name).toBe(`caption`)
    expect(topic_table_text_attribute_name).toBe(`text`)

    const post_table_name                     : `Post`      = db.tables.Post.name
    const post_table_id_attribute_name        : `id`        = db.tables.Post.attributes.id.name
    const post_table_author_id_attribute_name : `author_id` = db.tables.Post.attributes.author_id.name
    const post_table_text_attribute_name      : `text`      = db.tables.Post.attributes.text.name

    expect(post_table_name).toBe(`Post`)
    expect(post_table_id_attribute_name).toBe(`id`)
    expect(post_table_author_id_attribute_name).toBe(`author_id`)
    expect(post_table_text_attribute_name).toBe(`text`)
})
