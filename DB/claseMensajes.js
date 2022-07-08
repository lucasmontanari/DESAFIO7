const knex = require('knex')

module.exports = class ContenedorMensaje { //module.exports permite importar la clase en otro archivo usando require
    constructor(configuracion, nombreTabla) {
        this.database = knex(configuracion)
        this.nombreTabla=nombreTabla
        const crearTabla = async () => {
            const exist = await this.database.schema.hasTable(nombreTabla)
            if (!exist) {
                try {
                    await this.database.schema.createTable(nombreTabla, (producto) => {
                        producto.increments("id").primary();
                        producto.string("email", 15).notNullable();
                        producto.string("fyh", 50).notNullable();
                        producto.string("mensaje", 50).notNullable();
                    });
                    console.log("Table created!");
                } catch (e) {
                    console.log(e)
                }
            }else{
                console.log("Table already exist");
            }
        }
        crearTabla()
    }

    async save(objeto) {
        try {
            await this.database(this.nombreTabla).insert(objeto)

            console.log('Mensaje Insertado en tabla')

        } catch (e) {
            console.log(e)
        }
    }

    async getById(numeroID) {
        try {
            const producto = await this.database.from(this.nombreTabla).select('email', 'fyh', 'mensaje').where("id", "=", numeroID)
            return producto
        } catch (e) {
            console.log(e);
        }
    }

    async getAll() {
        try {
            const productos = await this.database.from(this.nombreTabla).select('email', 'fyh', 'mensaje');
            return productos
        } catch (e) {
            console.log(e);
        }
    }
}
