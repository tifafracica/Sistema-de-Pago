var comprasDelCliente = [];
var inputProducto = $('#input-producto');
var inputPrecio = $('#input-precio');
var ulLista = $('#lista-articulos-comprados')

var articuloComprado = {
    productoComprado: null,
    precioAbonar: null
};

var subtotal;


function AgregarProductoALaListaDeCompras(){ // agrega el producto y su precio 
    var nombreProducto = inputProducto.val().trim();  
    var precioProduto = inputPrecio.val().trim();
   
    if (nombreProducto  && precioProduto) {
        
        articuloComprado = { // pisamos la variable goblar con la informacion obtenida de los inputs
            productoComprado: nombreProducto,
            precioAbonar: precioProduto      
        };

        $(".lista-compra-container").css("display", "block");
        var itemDeLaLista = $('<li class="item">' + articuloComprado.productoComprado + ' ' + "$" + articuloComprado.precioAbonar + '</li>')
        var botonBorrar = $('<button class="borrar-item">Borrar Articulo</button>');
                
        itemDeLaLista.append(botonBorrar);
        ulLista.append(itemDeLaLista);

        comprasDelCliente.push(articuloComprado); // pusheamos el objeto dentro del array global.
        console.log(comprasDelCliente);
        var compraDelClienteJson = JSON.stringify(articuloComprado)
        localStorage.setItem("compras", compraDelClienteJson);
    } else {
        $("#inputs-incompletos").css("display", "block");
        $("#inputs-incompletos").text("*Completa los campos para avanzar" )
        setTimeout(function () {
            $("#inputs-incompletos").text("")
        }, 2000);        
        $("#inputs-incompletos").css("color", "red");
        
    }
      
     $('#input-producto').val('');
     $('#input-precio').val('');  
     
     borrarItemDeLaListaDeCompras(botonBorrar);
     calcularElSubtotal(); // aqui llamamos a la funcion una vez se haga on click se ejecute.
}; 

function borrarItemDeLaListaDeCompras (boton){ // funcion para que borre el articulo si el cliente se arrepiente.
    boton.on('click', function() {
        $(this).parent().remove();         
        
        var indice = comprasDelCliente.findIndex(item => item.productoComprado === articuloComprado.productoComprado); // buscar el indice de ese objeto del array
        comprasDelCliente.splice(indice,1); 
        console.log(comprasDelCliente);    
        calcularElSubtotal()    
    })
    
};

function calcularElSubtotal() { // aqui sumamos el monto de cada articulo para tener el subtotal de la compra.
    subtotal = 0;
    for (let i = 0; i < comprasDelCliente.length; i++) {
        var monto = parseInt(comprasDelCliente[i].precioAbonar);
        subtotal += monto;        
    }
   $("#subtotal-a-pagar").text("Subtotal" + " " + "$"+ subtotal)  
};

function comprarEnEfectivo() { 
    $("#total-a-pagar").css("display", "block") 
    $("#total-a-pagar").text("Total a Pagar:" + " " + "$"+ subtotal );
    $(".boton-pagar").css("display", "block") 
}

function comprarEnDebito() { 
    subtotal = (subtotal + (subtotal * 0.05))
    $("#total-a-pagar").css("display", "block")        
    $("#total-a-pagar").text("Total a Pagar:" + " " + "$"+ subtotal)
    $(".boton-pagar").css("display", "block")
}

function comprarEnCredito() { 
    subtotal = (subtotal + (subtotal * 0.10))
    $("#total-a-pagar").css("display", "block")        
    $("#total-a-pagar").text("Total a Pagar:" + " " + "$"+ subtotal)
    $(".ventana-cuotas").css("display", "block");
}

function comprarConCheque() { 
    subtotal = (subtotal + (subtotal * 0.20)) 
    $("#total-a-pagar").css("display", "block")       
    $("#total-a-pagar").text("Total a Pagar:" + " " + "$"+ subtotal)
    $(".boton-pagar").css("display", "block")
}

function calcularCuotas(){
    if($("#cero:checked").length){  
        $(".total-recargo").css("display", "block")
        $(".total-a-pagar-con-recargo").text("Total a Pagar: 1 cuota de" + " " + "$"+ subtotal)  
        $(".boton-pagar").css("display", "block")      
    }
    else if($("#doce:checked").length){  
        subtotal = (subtotal + (subtotal * 0.20)) 
        var cuota = (subtotal / 12).toFixed(2);
        $(".total-recargo").css("display", "block")
        $(".total-a-pagar-con-recargo").text("Total a Pagar con recargo " + " " + "$"+ subtotal)
        $(".cuota-a-pagar").text("Tu cuota abonar:" + " " + "$"+ cuota)
        $(".boton-pagar").css("display", "block")
    }
    else if($("#veinticuatro:checked").length){  
        subtotal = (subtotal + (subtotal * 0.45)) 
        var cuota = (subtotal / 24).toFixed(2);
        $(".total-recargo").css("display", "block")
        $(".total-a-pagar-con-recargo").text("Total a Pagar con recargo " + " " + "$"+ subtotal)
        $(".cuota-a-pagar").text("Tu cuota abonar:" + " " + "$"+ cuota)
        $(".boton-pagar").css("display", "block")
    }
    else if($("#treintayseis:checked").length){  
        subtotal = (subtotal + (subtotal * 0.70)) 
        var cuota = (subtotal / 36).toFixed(2);
        $(".total-recargo").css("display", "block")
        $(".total-a-pagar-con-recargo").text("Total a Pagar con recargo " + " " + "$"+ subtotal)
        $(".cuota-a-pagar").text("Tu cuota abonar:" + " " + "$"+ cuota)
        $(".boton-pagar").css("display", "block")
    }
    DeudaAlLocalStorage() 
}

function DeudaAlLocalStorage(){
    var subtotalJson = subtotal
    var deuda = localStorage.getItem("deudaAcumulada")
    if(!deuda) {
        localStorage.setItem("deudaAcumulada", subtotalJson);
        console.log(localStorage.deudaAcumulada);
    }else {
        deuda = parseFloat(deuda)
        deuda += subtotal;
        localStorage.setItem("deudaAcumulada", deuda)
    }

    return deuda;
    //$("#insertar-texto").text("Su deuda es" + " " + deuda);
    
}

function pagarCompra(){
    $('.modal').modal({
        fadeDuration: 250,
        fadeDelay: 0.80,        
    }),
    $("#insertar-texto").text("gracias por tu compra");
}

function calcularDeuda() {
    var deuda = localStorage.getItem("deudaAcumulada")
    console.log(deuda, 123)
    $('.modal').modal({
        fadeDuration: 250,
        fadeDelay: 0.80,           
    });
    $("#insertar-texto").text("su deuda es" + " " + "$" + deuda || 0);       
}

function hacerNuevaCompra() {    
    location.reload()     
}

function ayuda(){
    $('.modal').modal({
        fadeDuration: 250,
        fadeDelay: 0.80,        
    }),
    $("#insertar-texto").text("Todos los operadores se encuentran ocupados");
} 

function darDeBaja() {
    $('.modal').modal({
        fadeDuration: 250,
        fadeDelay: 0.80,        
    }),
    $("#insertar-texto").text("opcion invalida, ya vendiste tu alma al diablo Muajajaja LTA");
}

function salir(){
    $('.modal').modal({
        fadeDuration: 250,
        fadeDelay: 0.80,    
           
    }),
    $("#insertar-texto").text("gracias por usar nuestro servicio");
    
} 

/*function salirDelSistema(){
    $("#custom-close").modal({
        closeClass: 'icon-remove',        
      });
      location.reload() 
}*/