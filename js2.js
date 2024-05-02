function step_lv(player){
    draw_on_pole(player.x,player.y,);
    player.x--;
}
function step_pr(player){
    draw_on_pole(player.x,player.y,);
    player.x++;
}
function step_vv(player){
    draw_on_pole(player.x,player.y,);
    player.y--;
}
function step_vn(player){
    draw_on_pole(player.x,player.y,);
    player.y++;
}

function whatdirrection(player, direction){
    if (direction==0){
        step_lv(player);
    }
    else if (direction==1){
        step_pr(player);
    }
    else if (direction==2){
        step_vv(player);
    }
    else if (direction==3){
        step_vn(player);
    }
}

var max_vost_pc_k_hod=5;

function vost_pc_k_hod(){
    return rand(max_vost_pc_k_hod);
}


function full_healh(player){
    player.healh=player.max_health;
}

function ubrat_lacky(player,tipe){
    player.lacky.delete(tipe);
}

function prov_hk(player){
    if (player.healh<0){player.healh=0;}
    if (player.power<0){player.power=0;}
    if (player.defen<0){player.defen=0;}
    if (player.agility<0){player.agility=0;}
    if (player.critcanse<0){player.critcanse=0;}
    if (player.vampirizm<0){player.vampirizm=0;}

    if (lacky_has(player, "меч Всевластия")){
        if (player.power<mif_zn){player.power=mif_zn;}
    }
    if (lacky_has(player, "щит Эгиды")){
        if (player.defen<mif_zn){player.defen=mif_zn;}
    }
    
}


function has_no(tipe){
    for (x of p1.lacky) {
        if(x[0]==tipe){
            return false;
        }
    }
    for (x of p2.lacky) {
        if(x[0]==tipe){
            return false;
        }
    }

    return has_pole_zn(tipe);
}

function lacky_has(player, tipe){
    for (x of player.lacky) {
        if(x[0]==tipe){
            return true;
        }
    }
}

function has_pole_zn(tipe){
    for (i=0;i<10;i++){
        for (j=0;j<10;j++){
            if (pole[i][j]==tipe){
                return false;
            }
        }
    }
    return true;
}

function set_lacky_event(zn_st,player, tipe){
    player.lacky.set(tipe, player.lacky.has(tipe) ? player.lacky.get(tipe) + zn_st : zn_st);
}

function showblock(name,nomber){
    if (nomber==0){
        if (name=="игрок"){
            $("#pl_info_battle").slideToggle(2000);
        }
        if (name=="компьютер"){
            $("#pc_info_battle").slideToggle(2000);
        }
    }
    if (nomber==1){
        if (name=="игрок"){
            $("#pl_info_battle_monstr").slideToggle(2000);
        }
        if (name=="компьютер"){
            $("#pc_info_battle_monstr").slideToggle(2000);
        }
    }

}


function poisk_min(x,y){
    return Math.min(x,y);
}

function poisk_max(x,y){
    return Math.max(x,y);
}

function rand(max) {
    return Math.floor(Math.random() * max);
}

function what_pc_dirrection(x,y){
    dirrection=rand(4);
    if (x==0 && dirrection==0){
        dirrection=1;
    }
    if (y==0 && dirrection==2){
        dirrection=3;
    }
    if (x==9 && dirrection==1){
        dirrection=0;
    }
    if (y==9 && dirrection==3){
        dirrection=2;
    }
    return dirrection;
}

function svet_in_the_dark(x,y,what){
    if (what==0){
        if (x!=0){
            document.getElementById("pole"+(x-1)+"x"+y).setAttribute("class","cell");
        }
        if (x!=9){
            document.getElementById("pole"+(x+1)+"x"+y).setAttribute("class","cell");
        }
        if (y!=0){
            document.getElementById("pole"+x+"x"+(y-1)).setAttribute("class","cell");
        }
        if (y!=9){
            document.getElementById("pole"+x+"x"+(y+1)).setAttribute("class","cell");
        }
        document.getElementById("pole"+x+"x"+y).setAttribute("class","cell");
    }
    if (what==1){
        if (x!=0){
            help_for_svet(x-1,y);
        }
        if (x!=9){
            help_for_svet(x+1,y);
        }
        if (y!=0){
            help_for_svet(x,y-1);
        }
        if (y!=9){
            help_for_svet(x,y+1);
        }
        document.getElementById("pole"+x+"x"+y).setAttribute("class","stolbtsi");
        draw_on_pole(x,y,pole[x][y]);
        
        //рисование компьютера на "уголках"
        if(x>0 && y>0){
            if((p1.x-1==p2.x)&&(p1.y-1==p2.y)){
                draw_on_pole(x-1,y-1,p2.name);
            }
        }
        if(x>0 && y<9){
            if((p1.x-1==p2.x)&&(p1.y+1==p2.y)){
                draw_on_pole(x-1,y+1,p2.name);
            }
        }
        if(x<9 && y<9){
            if((p1.x+1==p2.x)&&(p1.y+1==p2.y)){
                draw_on_pole(x+1,y+1,p2.name);
            }
        }
        if(x<9 && y>0){
            if((p1.x+1==p2.x)&&(p1.y-1==p2.y)){
                draw_on_pole(x+1,y-1,p2.name);
            }
        }
    }
}

function help_for_svet(x,y){
    document.getElementById("pole"+(x)+"x"+y).setAttribute("class","stolbtsi");
    draw_on_pole(x,y,pole[x][y]);
    if(p2.x==x && p2.y==y){
        draw_on_pole(x,y,p2.name);
    }
}



function is_it_event(player){
    if (pole[player.x][player.y]!="Ничего"){
        go_event(pole[player.x][player.y],player);
        pole[player.x][player.y]="Ничего";
    }
}

function draw_on_pole(x,y,what){
    document.getElementById("pole"+x+"x"+y).innerHTML=what_it_is(what);
}

function prov_buttons(x,y){
    if (x==0){
        document.getElementById("buttonLv").setAttribute("class","button_hide");
    }
    else {
        document.getElementById("buttonLv").setAttribute("class","button");
    }
    if (y==0){
        document.getElementById("buttonVv").setAttribute("class","button_hide");
    }
    else {
        document.getElementById("buttonVv").setAttribute("class","button");
    }
    if (x==9){
        document.getElementById("buttonPr").setAttribute("class","button_hide");
    }
    else {
        document.getElementById("buttonPr").setAttribute("class","button");
    }
    if (y==9){
        document.getElementById("buttonVn").setAttribute("class","button_hide");
    }
    else {
        document.getElementById("buttonVn").setAttribute("class","button");
    }
}



function vivod_event(player){
    if (player.name=="игрок"){
        document.getElementById("pl_info").innerHTML=p1.str_info();
    }
    if (player.name=="компьютер"){
        document.getElementById("pc_info").innerHTML=p2.str_info();
    }
}


function izm_zdorovie(zn, player){
    player.healh+=zn;
    if (zn<0){
        if (!player.isAlife()){
            player.healh=0;
        }
    }
    if (zn>0 && player.healh>player.max_health){
        player.max_health=player.healh;
    }
}

function izm_immunitet(zn, player){
    player.immunitet+=zn;
}

function izm_ataki(zn, player){
    player.power+=zn;
}

function izm_defen(zn, player){
    player.defen+=zn;
}

function odd_or_not(zn){
    if (zn>=0) {
        return "+";
    }
    else return "";
}

function unluckyPlayer(x, player, mess){

    if(player.has_immunitet()){
        izm_zdorovie(-player.lacky.get(x[0])+1, player);
    }
    else{
        izm_zdorovie(-player.lacky.get(x[0])-1, player);
    }
    player.immunitet--;
    player.lacky.set(x[0],x[1]-1);
    if (player.lacky.get(x[0])==0){
        player.lacky.delete(x[0]);
        message_for_pl(mess, player);
    }
}

function poterya_krovi(x, player, mess){

    izm_zdorovie(-player.lacky.get(x[0]), player);
    //сделать возможность заражения?
    player.lacky.set(x[0],x[1]-1);
    if (player.lacky.get(x[0])==0){
        player.lacky.delete(x[0]);
        message_for_pl(mess, player);
    }
}

function nepodvijen(x, player, mess){
    player.lacky.set(x[0],x[1]-1);
    if (player.lacky.get(x[0])==0){
        player.lacky.delete(x[0]);
        message_for_pl(mess, player);
    }
}

document.addEventListener('keydown', (event) => {
    const key = event.key;
    switch (key) {
        case 'ArrowUp':    strelka(2); break;
        case 'ArrowDown':  strelka(3); break;
        case 'ArrowLeft':  strelka(0); break;
        case 'ArrowRight': strelka(1); break;
    }
});

var gameover=false;

function strelka(dirrection){
    if (!gameover){
        switch(dirrection){
            case 0:
                if (p1.x==0){
                    break;
                }
                else{
                    nextstep(dirrection);
                    break;
                }
            case 2:
                if (p1.y==0){
                    break;
                }
                else{
                    nextstep(dirrection);
                    break;
                }       
            case 1:
                if (p1.x==9){
                    break;
                }
                else{
                    nextstep(dirrection);
                    break;
                }   
            case 3:
                if (p1.y==9){
                    break;
                }
                else{
                    nextstep(dirrection);
                    break;
                }       
        }
    }
}