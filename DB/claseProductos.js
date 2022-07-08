const knex = require('knex')

module.exports = class ContenedorProducto { //module.exports permite importar la clase en otro archivo usando require
    constructor(configuracion, nombreTabla) {
        this.database = knex(configuracion)
        this.nombreTabla=nombreTabla
        const crearTabla = async () => {
            const exist = await this.database.schema.hasTable(nombreTabla)
            if (!exist) {
                try {
                    await this.database.schema.createTable(nombreTabla, (producto) => {
                        producto.increments("id").primary();
                        producto.string("nombre", 15).notNullable();
                        producto.float("precio");
                        producto.string("imagen", 100).notNullable();
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

            console.log('Producto Insertado en tabla')

        } catch (e) {
            console.log(e)
        }
    }

    async getById(numeroID) {
        try {
            const producto = await this.database.from(this.nombreTabla).select('nombre', 'precio', 'imagen').where("id", "=", numeroID)
            return producto
        } catch (e) {
            console.log(e);
        }
    }

    async getAll() {
        try {
            const productos = await this.database.from(this.nombreTabla).select('nombre', 'precio', 'imagen');
            return productos
        } catch (e) {
            console.log(e);
        }
    }
}
