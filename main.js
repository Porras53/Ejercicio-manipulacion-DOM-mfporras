const link = "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json"

// Defining async function
async function getapi(url) {

    // Storing response
    const response = await fetch(url);

    // Storing data in form of JSON
    var data = await response.json();
    console.log(data);
    if (response) {
        hideloader();
    }
    show(data);
    showpunto2(data);
}
//fetch(link)
//.then(response => response.json())
//.then(data => {console.log(data); infor = data});
function hideloader() {
    document.getElementById('loading').style.display = 'none';
}


// Function to define innerHTML for HTML table
function show(data) {
    let tab =
        `<tr>
          <th>#</th>
          <th>Events</th>
          <th>Squirrel</th>
         </tr>`;
    // Loop to access all rows 
    for (var j = 0; j < data.length; j++) {
        if (data[j].squirrel) {
            tab += `<tr style="background-color:red;"> 
    <td>${j} </td>
    <td>${data[j].events}</td>
    <td>${data[j].squirrel}</td>         
    </tr>`;
        }
        else
        {
            tab += `<tr> 
    <td>${j} </td>
    <td>${data[j].events}</td>
    <td>${data[j].squirrel}</td>         
    </tr>`;
        }

    }
    // Setting innerHTML as tab variable
    document.getElementById("eventos").innerHTML = tab;
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function showpunto2(data)
{
    let arregloTodos=[];
    for (var j = 0; j < data.length; j++) {
        arregloTodos = arregloTodos.concat(data[j].events);
    }
    
    let eventosFiltrado = arregloTodos.filter( onlyUnique );

    console.log(eventosFiltrado);
    let arregloCorrelaciones=[];
    let diccionarioCorrelaciones={};

    for (var i = 0; i < eventosFiltrado.length; i++) {
        let tp = 0;
        let tn = 0;
        let fp = 0;
        let fn = 0;
        let evento = eventosFiltrado[i];
        
        for (var j = 0; j < data.length; j++) {
            let eventosEsta = (data[j].events).includes(evento);
            let squirrelAct= data[j].squirrel;
            if(eventosEsta && squirrelAct)
            {
                tp= tp+1;
            }else if (!(eventosEsta) && squirrelAct)
            {
                fp= fp+1;
            }else if(eventosEsta && !(squirrelAct))
            {
                fn= fn+1;
            }else if(!(eventosEsta) && !(squirrelAct))
            {
                tn= tn+1;
            }
        }
        let coorrelacion = mcc(tp,tn,fp,fn);
        arregloCorrelaciones.push(coorrelacion);
        diccionarioCorrelaciones[evento] = coorrelacion;
    }

    console.log(diccionarioCorrelaciones);
    //Sort al diccionario
    // Sort the array based on the second element
    diccionarioCorrelaciones= sort_object(diccionarioCorrelaciones)

        //diccionarioCorrelacionesi.sort(cmp=(lambda (x, y) : (y[1] - x[1])))
    console.log(diccionarioCorrelaciones);
    let tab =
        `<tr>
          <th>#</th>
          <th>Events</th>
          <th>Correlation</th>
         </tr>`;
    // Loop to access all rows 
    for (var j = 0; j < diccionarioCorrelaciones.length; j++) {

    tab += `<tr> 
    <td>${j} </td>
    <td>${diccionarioCorrelaciones[j]}</td>
    <td>${diccionarioCorrelaciones[eventosFiltrado[j]]}</td>         
    </tr>`;
    }
    let count=0;
    console.log(Object.keys(diccionarioCorrelaciones));
    eventosKeys=  Object.keys(diccionarioCorrelaciones)
    for (var j = 0; j < eventosKeys.length; j++) {

        tab += `<tr> 
        <td>${j} </td>
        <td>${eventosKeys[j]}</td>
        <td>${diccionarioCorrelaciones[eventosKeys[j]]}</td>         
        </tr>`;
        count = count +1;
        }



    // Setting innerHTML as tab variable
    document.getElementById("corre").innerHTML = tab;

}

function sort_object(obj) {
    items = Object.keys(obj).map(function(key) {
        return [key, obj[key]];
    });
    items.sort(function(first, second) {
        return second[1] - first[1];
    });
    sorted_obj={}
    $.each(items, function(k, v) {
        use_key = v[0]
        use_value = v[1]
        sorted_obj[use_key] = use_value
    })
    return(sorted_obj)
} 

function mcc(TP, TN, FP, FN){
    firstLine = (TP*TN) - (FP*FN)
    innerSqr = (TP+FP)*(TP+FN)*(TN+FP)*(TN+FN)
    sqr = Math.sqrt(innerSqr);
    return firstLine / sqr
}

getapi(link);