const ProductManager = require('./ProductManager.class')
const productManager = new ProductManager('./src/products.json');

const PUERTO = 8080;

const express = require("express")
const app = express()


async function setup() {

    app.use(express.urlencoded({ extended: true }))

    await productManager.init();

    app.listen(PUERTO, () => {
        console.log(`escuchando en el puerto ${PUERTO} `)
    })

    app.get("/", (req, res) => {
        res.send("servidor express")
    })


    app.get('/products', (req, res) => {
        let { limit } = req.query;
        productManager.getProducts()
            .then(products => {
                if (limit) {
                    res.send(products.slice(0, parseInt(limit)));
                } else {
                    res.send(products);
                }
            })
            .catch(err => res.status(500).send('Error al obtener productos'));
    });

    // Obtengo un producto por ID
    app.get('/products/:pid', async (req, res) => {
        const id = parseInt(req.params.pid);
    
        try {
            const product = await productManager.getProductById(id);
            if (product) {
                if (product.error) {
                    res.status(404).send(product.error);
                } else {
                    res.send(product);
                }
            } else {
                res.status(404).send('Producto no encontrado');
            }
        } catch (err) {
            res.status(500).send('Error al obtener el producto');
        }
    });
    

}

setup();







