exports.up = knex => knex.schema.createTable("tags", table =>{
    table.increments('id');
    table.text("name").notNullable();
    table.text("user_id").references("id").inTable("users");
    table.text("note_id").references("id").inTable("notes").onDelete("CASCADE");
})

exports.down = knex => knex.schema.dropTable("tags")