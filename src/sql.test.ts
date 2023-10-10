import * as sql from './sql'

test(`Smoke.`, () => {
    const db = sql.database(`FORUM`)
        .table(`User`)
            .primary_key(`id`, sql.Type.Integer)
            .attribute(`login`, sql.Type.Text)
        .table(`Topic`)
            .primary_key(`id`, sql.Type.Integer)
            .foreign_key(`author_id`, `User`, `id`)
            .attribute(`caption`, sql.Type.Text)
            .attribute(`text`, sql.Type.Text)
        .table(`Post`)
            .primary_key(`id`, sql.Type.Integer)
            .foreign_key(`author_id`, `User`, `id`)
            .attribute(`text`, sql.Type.Text)
        .end()

    // static checks
    const database_type : typeof sql.Database[typeof sql.type] = db[sql.type]
    const database_name : `FORUM`                              = db.name

    expect(database_type).toBe(sql.Database[sql.type])
    expect(database_name).toBe(`FORUM`)

    const user_table_type                 : typeof sql.Table[typeof sql.type] = db.tables.User[sql.type]
    const user_table_name                 : `User`                            = db.tables.User.name
    const user_table_id_attribute_name    : `id`                              = db.tables.User.attributes.id.name
    const user_table_id_attribute_type    : sql.Type.Integer                  = db.tables.User.attributes.id.type
    const user_table_id_primary_key_name  : `id`                              = db.tables.User.primary_keys.id.name
    const user_table_id_primary_key_type  : sql.Type.Integer                  = db.tables.User.primary_keys.id.type
    const user_table_login_attribute_name : `login`                           = db.tables.User.attributes.login.name
    const user_table_login_attribute_type : sql.Type.Text                     = db.tables.User.attributes.login.type

    expect(user_table_type).toBe(sql.Table[sql.type])
    expect(user_table_name).toBe(`User`)
    expect(user_table_id_attribute_name).toBe(`id`)
    expect(user_table_id_attribute_type).toBe(sql.Type.Integer)
    expect(user_table_id_primary_key_name).toBe(`id`)
    expect(user_table_id_primary_key_type).toBe(sql.Type.Integer)
    expect(user_table_login_attribute_name).toBe(`login`)
    expect(user_table_login_attribute_type).toBe(sql.Type.Text)

    const topic_table_type                            : typeof sql.Table[typeof sql.type] = db.tables.Topic[sql.type]
    const topic_table_name                            : `Topic`                           = db.tables.Topic.name
    const topic_table_id_attribute_name               : `id`                              = db.tables.Topic.attributes.id.name
    const topic_table_id_attribute_type               : sql.Type.Integer                  = db.tables.Topic.attributes.id.type
    const topic_table_id_primary_key_name             : `id`                              = db.tables.Topic.primary_keys.id.name
    const topic_table_id_primary_key_type             : sql.Type.Integer                  = db.tables.Topic.primary_keys.id.type
    const topic_table_author_id_foreign_key_name      : `author_id`                       = db.tables.Topic.foreign_keys.author_id.name
    const topic_table_author_id_foreign_key_table     : `User`                            = db.tables.Topic.foreign_keys.author_id.table
    const topic_table_author_id_foreign_key_attribute : `id`                              = db.tables.Topic.foreign_keys.author_id.attribute
    const topic_table_caption_attribute_name          : `caption`                         = db.tables.Topic.attributes.caption.name
    const topic_table_caption_attribute_type          : sql.Type.Text                     = db.tables.Topic.attributes.caption.type
    const topic_table_text_attribute_name             : `text`                            = db.tables.Topic.attributes.text.name
    const topic_table_text_attribute_type             : sql.Type.Text                     = db.tables.Topic.attributes.text.type

    expect(topic_table_type).toBe(sql.Table[sql.type])
    expect(topic_table_name).toBe(`Topic`)
    expect(topic_table_id_attribute_name).toBe(`id`)
    expect(topic_table_id_attribute_type).toBe(sql.Type.Integer)
    expect(topic_table_id_primary_key_name).toBe(`id`)
    expect(topic_table_id_primary_key_type).toBe(sql.Type.Integer)
    expect(topic_table_author_id_foreign_key_name).toBe(`author_id`)
    expect(topic_table_author_id_foreign_key_table).toBe(`User`)
    expect(topic_table_author_id_foreign_key_attribute).toBe(`id`)
    expect(topic_table_caption_attribute_name).toBe(`caption`)
    expect(topic_table_caption_attribute_type).toBe(sql.Type.Text)
    expect(topic_table_text_attribute_name).toBe(`text`)
    expect(topic_table_text_attribute_type).toBe(sql.Type.Text)

    const post_table_type                     : typeof sql.Table[typeof sql.type] = db.tables.Post[sql.type]
    const post_table_name                     : `Post`                            = db.tables.Post.name
    const post_table_id_attribute_name        : `id`                              = db.tables.Post.attributes.id.name
    const post_table_id_attribute_type        : sql.Type.Integer                  = db.tables.Post.attributes.id.type
    const post_table_id_primary_key_name      : `id`                              = db.tables.Post.primary_keys.id.name
    const post_table_id_primary_key_type      : sql.Type.Integer                  = db.tables.Post.primary_keys.id.type
    const post_table_author_id_attribute_name : `author_id`                       = db.tables.Post.attributes.author_id.name
    const post_table_author_id_attribute_type : sql.Type.Integer                  = db.tables.Post.attributes.author_id.type
    const post_table_text_attribute_name      : `text`                            = db.tables.Post.attributes.text.name
    const post_table_text_attribute_type      : sql.Type.Text                     = db.tables.Post.attributes.text.type

    expect(post_table_type).toBe(sql.Table[sql.type])
    expect(post_table_name).toBe(`Post`)
    expect(post_table_id_attribute_name).toBe(`id`)
    expect(post_table_id_attribute_type).toBe(sql.Type.Integer)
    expect(post_table_id_primary_key_name).toBe(`id`)
    expect(post_table_id_primary_key_type).toBe(sql.Type.Integer)
    expect(post_table_author_id_attribute_name).toBe(`author_id`)
    expect(post_table_author_id_attribute_type).toBe(sql.Type.Integer)
    expect(post_table_text_attribute_name).toBe(`text`)
    expect(post_table_text_attribute_type).toBe(sql.Type.Text)
})
