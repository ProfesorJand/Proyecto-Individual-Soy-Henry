/*[ ] Input de búsqueda para encontrar razas de perros por nombre
[ ] Área donde se verá el listado de razas de perros. Deberá mostrar su:
Imagen
Nombre
Temperamento
Peso
[ ] Botones/Opciones para filtrar por:
Temperamento
Raza existente (es decir las que vienen de la API) o agregada por nosotros (creadas mediante el form)
[ ] Botones/Opciones para ordenar tanto ascendentemente como descendentemente las razas de perro por:
Orden alfabético
Peso
[ ] Paginado para ir buscando y mostrando las siguientes razas, mostrando 8 razas por página. 
IMPORTANTE: Dentro de la Ruta Principal se deben mostrar tanto las razas de perros traidas desde la API como así también las de la base de datos,
pero NO está permitido almacenar en la base de datos las razas de perros de la API sino que solamente se pueden guardar aquellas creadas desde el form. */

import React, {useEffect, useState} from 'react';
import Dogs from './Dogs.jsx';
import Filter from './Filter.jsx';
import Order from './Order.jsx'
import Pagination from './Paginations.jsx';
// import Logo from '../../logoHenry.png'

export default function Home() {
    const [dogs, setDogs] = useState([]); // api de dogs... peticion al backend
    const [filter, setFilter] = useState([]); // data filtrado x input value
    const [breed, setBreed] = useState("all"); // data filtrado2 x input value para el order
    const [valueFilter, setValueFilter] = useState("");
    const [buleano, setBuleano] = useState(true); // condicion verdadero o falso
    const [currentPage, setCurrentPage] = useState(1);
    const [dataCurrentPage, setDataCurrentPage] = useState([]);
    const [totalPage, setTotalPage] = useState(0); // cantidad total de paginacion
    const [maxShow, setMaxShow] = useState(10); // cantidad max a mostrar por paginacion
    const [arrayPag, setArrayPag] = useState([]) // cantidad de paginacion inputs

    useEffect(async ()=>{
        await fetch('http://localhost:3001/dogs').then(r=>r.json()).then(all=>{setDogs([...all])})
        
        // max();
    },[])

    useEffect(()=>{
        setFilter(dogs);
        onFilter(breed);
    },[dogs])

    useEffect(()=>{
        if(!buleano){
            // max();
            // mostrarPerrosPag(currentPage)
        }
    },[filter])

    useEffect(()=>{
        onFilter(valueFilter)
    },[currentPage])

    useEffect(()=>{
        setArrayPag([])
        for(let i = 1; i <= totalPage; i++){
            setArrayPag((e)=>[...new Set([...e,i])])
        }
        //max();
    },[totalPage])

    function onFilter(breed, buleano = false, pag = currentPage){
        setBreed(breed);
        if(buleano){
            setCurrentPage(1);
            window.location.hash = "#1"
        }
        console.log("otro filtrado")
        setValueFilter(breed)
        if(breed.toLowerCase() === "all" || !breed){
            console.log("traer todos los dogs sin paginado")
            const totalPage = Math.ceil(dogs.length / maxShow);
            setTotalPage(totalPage);
            const otroFiltrado = [].concat(dogs).splice((pag * maxShow) - maxShow, maxShow);
            
            return setFilter(otroFiltrado);
        }
        const filtrado = dogs.filter((d)=>{
            if(d.breed_group){
                return d.breed_group.toLowerCase() === breed.toLowerCase()
            }  
        });

        const totalPage = Math.ceil(filtrado.length / maxShow);
        console.log(filtrado.length)
        console.log(totalPage)
        setTotalPage(totalPage);
        const otroFiltrado = [].concat(filtrado).splice((pag * maxShow) - maxShow, maxShow);
        console.log(otroFiltrado);
        // setFilter2(filtrado)
        setFilter(otroFiltrado);

       
    }

    function onOrder( arg, cambio , array = dogs ){
        console.log(arg)
        if(!arg){
            return
        }

        if(cambio === "A-Z"){
            const sorteado = array.sort(function(a, b) {
                console.log(a[arg])
                var x = a[arg]; var y = b[arg];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                
            });
            setDogs([].concat(sorteado)) // hago esto para que surta efecto el useState
        }else{
            const sorteado = array.sort(function(a, b) {
                console.log(a[arg])
                var x = a[arg] ? a[arg]: ""; var y = b[arg] ? b[arg]: "";
                
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            });
            setDogs([].concat(sorteado)) // hago esto para que surta efecto el useState
        }
    }
        
    // function max(){
    //     // console.log("filter.lenght = ", filter.length)
    //     // const totalPage = Math.ceil(filter.length / maxShow)
    //     // console.log("TotalPage ", total)
    //     // setTotalPage(total)
    // }   

    // function mostrarPerrosPag(pag = currentPage){ //cambiar a futuro a pag = 1
    //     const otroFiltrado = [].concat(filter);
    //     console.log(otroFiltrado.splice((pag * maxShow) - maxShow, maxShow));
    //     setBuleano(false);
    //     //setFilter(otroFiltrado)      
    // }
    
    return (
        <>
        <Filter onFilter={onFilter}/>
        <Order onOrder={onOrder}/>
        <Pagination arrayPag={arrayPag} setCurrentPage={setCurrentPage} currentPage={currentPage} totalPage={totalPage}/>
        {!buleano ? <p>BREED NOT FOUND, please insert another Breed in the filter</p>:
            <>
            <Dogs data={filter}/>
            </>
        }
        </>
    )
}