const express = require('express')
const app = express()
const path = require('path')
const { Server: IOServer } = require('socket.io')
const expressServer = app.listen(8080, () => console.log('Servidor escuchando puerto 8080'))
const io = new IOServer(expressServer)
const fs = require('fs')


const configMySQL = {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'desafio7'
    },
    pool: { min: 0, max: 7 }
}
const configSQLite3 = {
    client: 'sqlite3',
    connection: {
      filename: './DB/ecommerce.sqlite'
    },
    useNullAsDefault: true
}

const ContenedorProducto = require('./DB/claseProductos')
const productos = new ContenedorProducto(configMySQL, 'producto')
const ContenedorMensaje = require('./DB/claseMensajes')
const mensajes = new ContenedorMensaje(configSQLite3, 'mensaje')

let mensajesEnBaseDeDatos=[]
let productosEnBaseDeDatos = []

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(express.static(path.join(__dirname, './public')))


io.on('connection', async socket => {
    console.log(`Se conecto un usuario ${socket.id}`)

    try{
        productosEnBaseDeDatos = await productos.getAll()
        socket.emit('server:productos', productosEnBaseDeDatos)
    }catch(error){
        console.log(`Error al adquirir los productos ${error}`)
    }
    try{
        mensajesEnBaseDeDatos = await mensajes.getAll()
        socket.emit('server:mensajes', mensajesEnBaseDeDatos)
    }catch(error){
        console.log(`Error al adquirir los mensajes ${error}`)
    }
    socket.on('cliente:mensaje', async nuevoMensaje => {
        await mensajes.save(nuevoMensaje)
        mensajesEnBaseDeDatos = await mensajes.getAll()
        io.emit('server:mensajes', mensajesEnBaseDeDatos)
    })
    socket.on('cliente:producto', async nuevoProducto => {
        await productos.save(nuevoProducto)
        productosEnBaseDeDatos = await productos.getAll()
        io.emit('server:productos', productosEnBaseDeDatos)
    })
})