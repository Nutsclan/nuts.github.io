let form = document.querySelector('form');
let search = document.querySelector('.search');
let submit = document.querySelector('.submit');
let resultsElement = document.querySelector('.results');
let layer = document.querySelector('#layer');
let layer_content = document.querySelector('#layer_content');
let title = document.querySelector('.title');

title.onclick = function(){
    resultsElement.innerHTML = '';
    search.value = '';
}

function enter(key){
    if(key.keyCode === 13)
      search.submit();
}

function not_found(){
    let div = document.createElement('div');
    div.classList.add('not_found');
    div.innerText = 'No matches found.'
    resultsElement.appendChild(div);
}

submit.addEventListener('click', (event) => {
    event.preventDefault();
    resultsElement.innerHTML = '';
    let formData = new FormData(form);
    let keywords = formData.get('keywords');
    let exception = /[a-zA-Z/?=&]/;

    if( keywords.trim().length === 0 || exception.test(keywords) || keywords === '.' || 
    Number(keywords) < 50 || Number(keywords) > 70 ) not_found();
    else
    {
        let count = 0;
        for( let key in DATA )
        {
            for( let i = 0 ; i < DATA[key].length ; i++ )
                if( DATA[key][i].level === keywords || DATA[key][i].name.includes(keywords) || DATA[key][i].location.includes(keywords) || DATA[key][i].drop.includes(keywords) )
                {
                    let table = document.createElement('table');
                    table.classList.add('show_table');
                    let tr = document.createElement('tr');

                    let td_level = document.createElement('td');
                    td_level.classList.add('td_level');
                    td_level.innerHTML = 'Lv.'+ DATA[key][i].level;
                    tr.appendChild(td_level);

                    let td_hunt = document.createElement('td');
                    td_hunt.classList.add('td_hunt');
                    if( DATA[key][i].hunt === true )
                    {
                        let img = document.createElement('img');
                        img.classList.add('hunt_icon');
                        img.src = 'icon/hunt_icon.png'
                        td_hunt.appendChild(img);
                    }
                    else if( DATA[key][i].hunt === 'B' )
                    {
                        let img = document.createElement('img');
                        img.classList.add('SAB_icon');
                        img.src = 'icon/B_icon.png';
                        td_hunt.appendChild(img);
                    }
                    else if( DATA[key][i].hunt === 'A' || DATA[key][i].hunt === 'S' )
                    {
                        let img = document.createElement('img');
                        img.classList.add('SAB_icon');
                        img.src = 'icon/SA_icon.png';
                        td_hunt.appendChild(img);
                    }
                    tr.appendChild(td_hunt);

                    let td_name = document.createElement('td');
                    td_name.classList.add('td_name');
                    td_name.innerHTML = '<a class=\'name\'>' + DATA[key][i].name + '</a>';
                    tr.appendChild(td_name);

                    let td_location = document.createElement('td');
                    td_location.classList.add('td_location');
                    td_location.innerHTML = DATA[key][i].location;
                    tr.appendChild(td_location);

                    let td_coordinate = document.createElement('td');
                    td_coordinate.classList.add('td_coordinate');
                    td_coordinate.innerHTML = DATA[key][i].coordinate;
                    tr.appendChild(td_coordinate);

                    let td_drop = document.createElement('td');
                    td_drop.classList.add('td_drop');
                    td_drop.innerHTML = DATA[key][i].drop;
                    if( !td_drop.innerHTML.includes('&nbsp') )
                        td_drop.id='drop';
                    tr.appendChild(td_drop);

                    table.appendChild(tr);
                    resultsElement.appendChild(table);

                    count++;
                    /*
                    let table = document.createElement('table');
                    table.classList.add('show_table');
                    let tr = table.insertRow( table.rows.length );

                    let td_level = tr.insertCell(0);
                    td_level.classList.add('td_level');
                    td_level.innerHTML = 'Lv.'+ DATA[key][i].level;

                    let td_name = tr.insertCell(1);
                    td_name.classList.add('td_name');
                    td_name.innerHTML = '<a>' + DATA[key][i].name + '</a>';

                    let td_location = tr.insertCell(2);
                    td_location.classList.add('td_location');
                    td_location.innerHTML = DATA[key][i].location;

                    let td_coordinate = tr.insertCell(3);
                    td_coordinate.classList.add('td_coordinate');
                    td_coordinate.innerHTML = DATA[key][i].coordinate;

                    let td_drop = tr.insertCell(4);
                    td_drop.classList.add('td_drop');
                    td_drop.innerHTML = DATA[key][i].drop;

                    resultsElement.appendChild(table);
                    */
                }
        }
        for( let i = 0 ; i < resultsElement.childNodes.length ; i++ )
            resultsElement.childNodes[i].firstChild.childNodes[2].onclick = viewMap;

        if( count === 0 ) not_found();
        else
        {
            let div = document.createElement('div');
            div.classList.add('total');
            div.innerText = 'Total : '+ count;
            resultsElement.insertBefore(div, resultsElement.childNodes[0]);
        }
    }
});

function viewMap(){
    //console.log(this.childNodes[0].firstChild.childNodes[1].innerHTML);
    layer.style.visibility = 'visible';
    layer.style.opacity = 1;
    
    let img = document.createElement('img');
    img.classList.add('.map');
    let found = false;

    if( this.nextSibling.innerText === '아지스 라' )
        img.src = 'map/Azys_Lla/' + this.innerText + '.jpg';
    else
        for( let key in DATA)
        {
            for( let i = 0 ; i < DATA[key].length; i++ )
                if( DATA[key][i].name === this.innerText )
                {
                    img.src = 'map/' + key + '/'+ this.innerText + '.jpg';
                    found = true; break;
                }
            if( found === true ) break;
        }

    let info = document.createElement('div');
    info.classList.add('info');

    if( this.nextSibling.nextSibling.innerText === '지도 참조' )
        info.innerText = this.innerText;
    else
        info.innerText = this.innerText + ' ' + this.nextSibling.nextSibling.innerText;

    layer_content.appendChild(info);
    layer_content.appendChild(img);
    
    window.onkeyup = function(esc){
        let key = esc.keyCode ? esc.keyCode : esc.which;

        if( key === 27)
        {
            layer.style.visibility = 'hidden';
            layer.style.opacity = 0;
            layer_content.removeChild(info);
            layer_content.removeChild(img);
        }
    }

    layer.onclick = function(){
        layer.style.visibility = 'hidden';
        layer.style.opacity = 0;
        layer_content.removeChild(info);
        layer_content.removeChild(img);
    }
}

$(window).scroll(function(event){
    var scroll = $(window).scrollTop();
  if (scroll >= 50) {
      $(".top_button").addClass("show");
  } else {
      $(".top_button").removeClass("show");
  }
});

$('a').click(function(){
  $('html, body').animate({
      scrollTop: $( $(this).attr('href') ).offset().top
  }, 1000);
});
