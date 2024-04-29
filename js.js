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

function nextstep(direction)
{
    step++; 
    svet_in_the_dark(p1.x,p1.y,0);
    if (!lacky_has(p1,"Неподвижность")){
        if(!lacky_has(p1,"Опьянение")){
            whatdirrection(p1, direction);
        }
        else {
            dirrection=-1;
            do{
                dirrection=what_pc_dirrection(p1.x,p1.y);
            }
            while (direction==dirrection);
            direction=dirrection;
            whatdirrection(p1, direction);
        }
    }
    p1.info=[];
    p2.info=[];   

    //начало хода
    first_step(p1);
    first_step(p2);

    //Проверка живы ли
    if (!Are_they_alive(p1, p2)){
        document.getElementById("contbutton").setAttribute("class","contbutton_hide");
        document.getElementById("Button_NG").removeAttribute("hidden");
    }
    else{
        //действия игрока
        is_it_event(p1);

        //действия компьютера
        if (!lacky_has(p2,"Неподвижность")){
            p2.healh+=vost_pc_k_hod();
            //document.getElementById("pole"+(p2.x)+"x"+p2.y).setAttribute("class","cell");
            whatdirrection(p2, what_pc_dirrection(p2.x,p2.y));
            //document.getElementById("pole"+(p2.x)+"x"+p2.y).setAttribute("class","stolbtsi");
            is_it_event(p2);
        }


        //Проверка живы ли
        if (!Are_they_alive(p1, p2)){
            document.getElementById("contbutton").setAttribute("class","contbutton_hide");
            document.getElementById("Button_NG").removeAttribute("hidden");
        }
        else {
            if (p2.x == p1.x && p2.y==p1.y){
                Battle0();
            }       
        
            lucky_x = rand(10);
            lucky_y = rand(10);
            if (((lucky_x!=p1.x && lucky_y!=p1.y)||(lucky_x!=p2.x && lucky_y!=p2.y)) && pole[lucky_x][lucky_y]=="Ничего"){
                let rez = lacky_chance();
                if (rez!=""){
                    //draw_on_pole(lucky_x,lucky_y, rez);
                    pole[lucky_x][lucky_y]=rez;
                }
            }
        }
    }
        
    //окончательные действия
    prov_buttons(p1.x,p1.y);

    //draw_on_pole(p2.x,p2.y,p2.name);
    document.getElementById("pl_stats").innerHTML=p1.str();
    document.getElementById("pc_stats").innerHTML=p2.str();
    vivod_event(p1);
    vivod_event(p2);

    svet_in_the_dark(p1.x,p1.y,1);
    draw_on_pole(p1.x,p1.y,p1.name);
}

var max_vost_pc_k_hod=5;

function vost_pc_k_hod(){
    return rand(max_vost_pc_k_hod);
}

function first_step(player){
    for (x of player.lacky) {
        switch(x[0]){
            case "Яд":
                unluckyPlayer(x, player, "Яд был выведен");
                break;
            case "Отравление":
                unluckyPlayer(x, player, "Отравление закончилось");
                break; 
            case "Кислота":
                unluckyPlayer(x, player, "Рана, разъедаемая кислотой, больше не болит");
                break;                
            case "Кровотечение":
                poterya_krovi(x, player, "Кровотечение остановилось");
                break;         
            case "Неподвижность":
                nepodvijen(x, player, "Наконец-то свобода");
                break;            
            case "Опьянение":
                nepodvijen(x, player, "Опьянение спало");
                break;
        }
    }
}

function lucky_event(zn_st, player, tipe){
    switch (tipe){
        case "змейка":
            set_lacky_event(zn_st, player, 'Яд');
            break;
        case "мухоморы":
        case "гнилое яблоко":
            set_lacky_event(zn_st,player, 'Отравление');
            break;        
        case "болото":
            set_lacky_event(zn_st,player, 'Неподвижность');
            break;  
        case "винишко":
            set_lacky_event(zn_st,player, 'Опьянение');
            break; 
        case "мина":      
        case "колючая проволока":
            set_lacky_event(zn_st,player, 'Кровотечение');
            break;
        case "ядовитое болото":
            set_lacky_event(zn_st,player, 'Неподвижность');
            set_lacky_event(zn_st,player, 'Яд');
            break;
        case "кислотное болото":
            set_lacky_event(zn_st,player, 'Неподвижность');
            set_lacky_event(zn_st,player, 'Кислота');
        case "кислотная лужа":
            set_lacky_event(zn_st,player, 'Кислота');
            break;
        //оружие
        case "меч Всевластия":
            set_lacky_event(zn_st,player, "меч Всевластия");
            break;        
        case "щит Эгиды":
            set_lacky_event(zn_st,player, "щит Эгиды");
            break;
    }
}

function go_event(tipe, player){
    switch (tipe){

        //отрицательные эффекты

        case "змейка":
            zn=rand(yad_zmeiki)-5;
            izm_zdorovie(zn,player);
            zn_st=rand(stepen_yada_zmeiki)+1;
            if(!player.has_immunitet()){
                zn_st++;
                message_for_pl("Встреча со змейкой. Здоровье "+zn+". Иммунитет слаб, время избавления от яда увеличено до " + zn_st + ". Но организм приспособился, иммунитет +1", player);
                player.immunitet++;
            }
            else{
                message_for_pl("Встреча со змейкой. Здоровье "+zn+". Время избавления от яда: " + zn_st, player);
                player.immunitet--;
            }
            lucky_event(zn_st, player, tipe);
            break;

        case "метеорит":
            zn=Math.floor((poisk_max(p1.healh,p2.healh))/(rand(stepen_udara_meteirita)+1))+1;
            izm_zdorovie(-zn,player);
            message_for_pl("Рядом упал метеорит. Здоровье -"+zn, player);  
            break;          
            
        case "мина":
            zn=Math.floor((poisk_max(p1.healh,p2.healh))/(rand(stepen_podriva_mini)+1))+1;
            izm_zdorovie(-zn,player);
            if(!player.isAlife()){
                message_for_pl("Попал на мину. Здоровье -"+zn, player);
            }             
            else{
                zn_st=rand(stepen_krovi_ot_mini)+1;
                message_for_pl("Попал на мину. Здоровье -"+zn+". Время кровотечения: " + zn_st, player);
                lucky_event(zn_st, player, tipe); 
            }
            break;        
        
        case "ловушка":
            zn=rand(zn_lovushki)+1;
            izm_zdorovie(-zn,player);
            message_for_pl("Попал в ловушку. Здоровье -"+zn, player);  
            break;     

        case "колючая проволока":
            zn=rand(zn_koluchei_provoloki)+1;
            izm_zdorovie(-zn,player);
            zn_st=rand(stepen_koluchei_provoloki)+1;
            message_for_pl("Попал в колючую проволоку. Здоровье -"+zn+". Время кровотечения: " + zn_st, player);
            lucky_event(zn_st, player, tipe); 
            break;         
            
        case "кислотная лужа":
            zn=rand(zn_kislot_luji)+1;
            izm_zdorovie(-zn,player);
            zn_st=rand(stepen_kislot_luji)+1;
            message_for_pl("Ступил в кислотную лужу. Здоровье -"+zn+". Время исцеления от раны, разъедаемой кислотой: " + zn_st, player);
            lucky_event(zn_st, player, tipe); 
            break; 

        case "мухоморы":
            zn=rand(minus_ot_muhomora)-5;
            izm_zdorovie(zn,player);
            zn_st=rand(stepen_muhomora)+1;
            if(!player.has_immunitet()){
                zn_st++;
                message_for_pl("Не те грибы! Объелся мухоморами. Здоровье "+zn+". Иммунитет слаб, время отравления увеличено до " + zn_st + ". Но организм приспособился, иммунитет +1", player);
                player.immunitet++;
            }
            else{
                message_for_pl("Не те грибы! Объелся мухоморами. Здоровье "+zn+". Время отравления: " + zn_st, player);
                player.immunitet--;
            }
            lucky_event(zn_st, player, tipe);
            break;  
            
        case "гнилое яблоко":
            zn=rand(minus_ot_gnilogo_appla)-5;
            izm_zdorovie(zn,player);
            zn_st=rand(stepen_gnilogo_appla)+1;
            if(!player.has_immunitet()){
                zn_st++;
                message_for_pl("Тьфу, яблоко попалось гнилое! Здоровье "+zn+". Иммунитет слаб, время отравления увеличено до " + zn_st + ". Но организм приспособился, иммунитет +1", player);
                player.immunitet++;
            }
            else{
                message_for_pl("Тьфу, яблоко попалось гнилое! Здоровье "+zn+". Время отравления: " + zn_st, player);
                player.immunitet--;
            }
            lucky_event(zn_st, player, tipe);
            break;                      
  
        case "болото":
            zn_st=rand(stepen_bolota)+1;
            message_for_pl("Застрял в трясине. Время вызволения: " + zn_st, player);
            lucky_event(zn_st, player, tipe);
            break;         
            
        case "винишко":
            zn_st=rand(stepen_vinishka)+1;
            message_for_pl("Напился. Время опьянения: " + zn_st, player);
            lucky_event(zn_st, player, tipe);
            break;

        case "кислотное болото":
            zn_st=rand(stepen_bolota)+1;
            message_for_pl("Попал в кислотное болото. Время вызволения: " + zn_st, player);
            lucky_event(zn_st, player, tipe);
            break;         

        case "ядовитое болото":
            zn_st=rand(stepen_bolota)+1;
            message_for_pl("Попал в ядовитое болото. Время вызволения: " + zn_st, player);
            lucky_event(zn_st, player, tipe);
            break;              

        case "ядовитая трава":
        case "червивое яблоко":
            rand_hka_minus(player, st_izm_hki, tipe);        
            break; 

        //только положительные эффекты

        case "аптечка":
            zn=rand(aptechka)+5;
            izm_zdorovie(zn,player);
            message_for_pl("Была найдена лекарственная трава. Здоровье "+odd_or_not(zn)+zn,player);
            break;        

        case "пластырь":
            zn=rand(zn_plastir)+5;
            izm_zdorovie(zn,player);
            if (lacky_has(player,"Кровотечение")){
                ubrat_lacky(player,"Кровотечение");
                message_for_pl("Был использован пластырь. Кровотечение остановилось. Здоровье "+odd_or_not(zn)+zn,player);
            }
            else{
                message_for_pl("Был использован пластырь. Здоровье "+odd_or_not(zn)+zn,player);
            }
            break;        
            
        case "дорогое вино":
            if (lacky_has(player,"Кислота")){
                ubrat_lacky(player,"Кислота");
                rand_hka_plus(player, zn_vino, tipe + " кислота");
            }
            else{
                rand_hka_plus(player, zn_vino, tipe);
            }
            break;

        case "яблоко":
            zn=zn_apple;
            izm_zdorovie(zn,player);
            message_for_pl("Яблоки просто вкуснейшие. Здоровье "+odd_or_not(zn)+zn,player);      
            break; 
        
        case "травка":
            zn=zn_travki;
            izm_immunitet(zn,player);
            message_for_pl("Торговец не обманул! Эта трава и правда повышает иммунитет. Иммунитет "+odd_or_not(zn)+zn,player);      
            break; 

        case "единичка к статам":
            rand_hka_plus(player, 1, );        
            break;    

        case "линчжи":       
        case "золотое яблоко":
        case "вино":
            rand_hka_plus(player, st_izm_hki, tipe);        
            break;  
            
        //мифические артефакты
        case "меч Всевластия":
            zn=mif_zn;
            izm_ataki(zn,player);
            lucky_event(-1, player, tipe);
            message_for_pl("Вот это удача! Найден меч Всевластия! Атака +"+zn, player);
            break; 

        case "щит Эгиды":
            zn=mif_zn;
            izm_defen(zn,player);
            lucky_event(-1, player, tipe);
            message_for_pl("Вот это удача! Найден щит Эгиды! Защита +"+zn, player);
            break; 
    }
    draw_on_pole(player.x,player.y,);
}

function ubrat_lacky(player,tipe){
    player.lacky.delete(tipe);
}

//настройка данных
//только лечение
var aptechka = 25;
var zn_apple = 25;
var zn_plastir = 15;

//знаения неудач
var yad_zmeiki = -25;
var stepen_yada_zmeiki = 10;
var stepen_udara_meteirita = 20;
var stepen_podriva_mini=50;
var stepen_krovi_ot_mini = 20;
var minus_ot_muhomora = -35;
var stepen_muhomora = 15;
var minus_ot_gnilogo_appla = -15;
var stepen_gnilogo_appla = 5;
var zn_lovushki = 25;
var stepen_bolota = 15;
var stepen_vinishka = 10;
var zn_koluchei_provoloki = 25;
var stepen_koluchei_provoloki = 10;
var zn_kislot_luji = 25;
var stepen_kislot_luji = 10;

//значения плюсов
var mif_zn =100;
var st_izm_hki =20;
var zn_travki=10;
var sten_umnoj_zdr = 5;
var zn_vino = 40;

function rand_hka_plus(player, zn0, tipe){
    mess="";
    hka="";
    zn=rand(zn0)+5;

    switch(rand(7)){
        case 0:
            //здоровье
            zn*=(rand(sten_umnoj_zdr)+1);
            player.healh+=zn;
            hka="Здоровье +";  
            break;     
        case 1:
            //Атака
            player.power+=zn;
            hka="Атака +";     
            break;   
        case 2:
            //Защита
            player.defen+=zn;
            hka="Защита +";    
            break;    
        case 3:
            //Ловкость
            player.agility+=zn;
            hka="Ловкость +";       
            break; 
        case 4:
            //Шанс крита
            player.critcanse+=zn;
            hka="Шанс крита +";    
            break;    
        case 5:
            //Вампиризм
            player.vampirizm+=zn;
            hka="Вампиризм +";
            break;        
        case 6:
            //Иммунитет
            player.immunitet+=zn;
            hka="Иммунитет +";
            break;
    }
    switch(tipe){
        case "линчжи":
            mess= "Вот это удача! Попался линчжи! "
            break;      
        case "золотое яблоко":
            mess= "Вот это удача! Попалось золотое яблоко! "
            break;    
        case "дорогое вино кислота":
            mess= "Торговец хорош! Вино просто отличное! Рана из-за кислоты больше не болит. "
            break;        
        case "дорогое вино":
            mess= "Торговец хорош! Вино просто отличное! "
            break;
    }

    message_for_pl(mess+hka+zn, player);
}

function rand_hka_minus(player, zn0, tipe){
    mess="";
    hka="";
    zn=rand(zn0)+5;

    switch(rand(7)){
        case 0:
            //здоровье
            zn*=(rand(sten_umnoj_zdr)+1);
            player.healh-=zn;
            hka="Здоровье -";  
            break;     
        case 1:
            //Атака
            player.power-=zn;
            hka="Атака -";     
            break;   
        case 2:
            //Защита
            player.defen-=zn;
            hka="Защита -";    
            break;    
        case 3:
            //Ловкость
            player.agility-=zn;
            hka="Ловкость -";       
            break; 
        case 4:
            //Шанс крита
            player.critcanse-=zn;
            hka="Шанс крита -";    
            break;    
        case 5:
            //Иммунитет
            player.immunitet-=zn;
            hka="Иммунитет -";      
            break;  
        case 6:
            //Вампиризм
            player.vampirizm-=zn;
            hka="Вампиризм -";
            break;
    }
    switch(tipe){
        case "ядовитая трава":
            mess= "Торговец подсунул какую-то ядовитую траву! "
            break;  
        case "червивое яблоко":
            mess= "Тьфу, яблоко попалось с червями! "
            break;         
    }

    prov_hk(player);
    message_for_pl(mess+hka+zn, player);
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

//настройка шансов
var обычный = 50;
var редкий = 400;
var уникальный = 3000;
var легендарный = 20000;
var мифический = 100000;

function lacky_chance(){

    //обычные
    if (rand(обычный)<1){
        return "мухоморы";
    }
    if (rand(обычный)<1){
        return "ловушка";
    }
    if (rand(обычный)<1){
        return "болото";
    }
    if (rand(обычный)<1){
        return "травка";
    }
    if (rand(обычный)<1){
        return "яблоко";
    }
    if (rand(обычный)<1){
        return "винишко";
    }

    //редкие
    if (rand(редкий)<1){
        return "змейка";
    }
    if (rand(редкий)<1){
        return "единичка к статам";
    }
    if (rand(редкий)<1){
        return "аптечка";
    }
    if (rand(редкий)<1){
        return "колючая проволока";
    }
    if (rand(редкий)<1){
        return "пластырь";
    }
    if (rand(редкий)<1){
        return "ядовитая трава";
    }
    if (rand(редкий)<1){
        return "линчжи";
    }
    if (rand(редкий)<1){
        return "ядовитое болото";
    }
    if (rand(редкий)<1){
        return "кислотная лужа";
    }
    if (rand(редкий)<1){
        return "гнилое яблоко";
    }
    if (rand(редкий)<1){
        return "вино";
    }

    //уникальные
    if (rand(уникальный)<1){
        return "метеорит";
    }
    if (rand(уникальный)<1){
        return "золотое яблоко";
    }
    if (rand(уникальный)<1){
        return "мина";
    }
    if (rand(уникальный)<1){
        return "дорогое вино";
    }

    //легендарные
    if (rand(легендарный)<1){
        return "кислотное болото";
    }


    //мифические
    if (rand(мифический)<1) {
        if (has_no("меч Всевластия")){
            return "меч Всевластия";
        }
    }
    if (rand(мифический)<1) {
        if (has_no("щит Эгиды")){
            return "щит Эгиды";
        }
    }

    return "";
}

var тестовый = "дорогое вино";
var тестовый2 = "винишко";

function what_it_is(what){
    switch(what){
        case "игрок":
            return "<img src='img/человечек.png'>";
        
        case "компьютер":
            return "<img src='img/компьютер.png'>";
       
        case "аптечка":
            return "<img src='img/травка.png'>";

        case "ядовитая трава":
        case "травка":
        case "дорогое вино":
            return "<img src='img/торговец.png'>";

        case "змейка":
            return "<img src='img/змейка.png'>";         
            
        case "болото":        
        case "ядовитое болото":
        case "кислотная лужа":
        case "кислотное болото":
            return "<img src='img/лужа.png'>";         
            
        case "ловушка":
        case "мина":        
        case "колючая проволока":
            return "<img src='img/ловушка.png'>";

        case "мухоморы":
        case "линчжи":
            return "<img src='img/гриб.png'>";

        case "золотое яблоко":
        case "яблоко":
        case "гнилое яблоко": 
        case "червивое яблоко":
            return "<img src='img/яблоко.png'>";

        case "единичка к статам":
            return "<img src='img/пять.png'>"; 

        case "пластырь":
            return "<img src='img/пластырь.png'>";

        case "вино":
        case "винишко":
            return "<img src='img/вино.png'>";
        
        case "щит Эгиды":
        case "меч Всевластия":
            return "<img src='img/сундук.png'>";

        default:
            return "";
    }
}

//поле
let pole = [[]];

function first_and_last_step(){

        p1 = new Player("игрок", 500, 20, 10, 10, 5, 50, 5);
        p2 = new Player("компьютер", 500, 20, 10, 10, 5, 50, 5);

        //распределение начальных ресурсов
        
        pole.length=10;
        for (var i=0; i<10; i++)
        {
            pole[i] = new Array();
            pole[i].length = 10;
        }
        for (var i=0; i<pole.length; i++)
          for (var j=0; j<pole[i].length; j++)
            pole[i][j] = "Ничего";

        for (i=0;i<10;i++){
            for (j=0;j<10;j++){

                if (i==1 && j==1){
                    continue;
                }
                if (i==8 && j==8){
                    continue;
                }
                
                let rez = lacky_chance();
                if (rez!=""){
                    //draw_on_pole(i,j, rez);
                    pole[i][j]=rez;
                } 

                // if (i==0 && j==1){
                //     pole[i][j]=тестовый;
                // }
                // if (i==1 && j==0){
                //     pole[i][j]=тестовый2;
                // }
                               
            }
        }

        //начальное положение на карте

        //draw_on_pole(p2.x,p2.y, p2.name);
        svet_in_the_dark(p1.x,p1.y,1);
        draw_on_pole(p1.x,p1.y, p1.name);
        document.getElementById("pl_stats").innerHTML=p1.str();
        document.getElementById("pc_stats").innerHTML=p2.str();
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

function Battle0(){
    for (i=0;i<10;i++){
        ataka0(p1,p2);
        ataka0(p2,p1);
        if (Are_they_alive(p1,p2)){
            if (i<9){
                continue;
            }
            else {
                message_for_pl("Враг сбежал", p1);
                while (true){
                    lucky_x = rand(10);
                    lucky_y = rand(10);
                    if ((lucky_x!=p1.x && lucky_y!=p1.y) && pole[lucky_x][lucky_y]=="Ничего"){
                        p2.x=lucky_x;p2.y=lucky_y;
                        //draw_on_pole(p2.x,p2.y,p2.name);
                        if (lacky_has(p2,"Неподвижность")){
                            ubrat_lacky(p2,"Неподвижность");
                        }
                        break;
                    }
                }
            }
        }
        else {
            document.getElementById("contbutton").setAttribute("class","contbutton_hide");
            document.getElementById("Button_NG").removeAttribute("hidden");
            break;
        }
   }
}

//для боя
var stepen_crita=10;
var zn_crita=1.5;
var stepen_uklona=10;
var stepen_vamp=10;
var zn_vamp=10;

function ataka0(player,enemy){
    mess="";

    //вампиризм
    max=poisk_min(player.vampirizm,enemy.vampirizm)+1;
    max*=stepen_vamp;
    if (player.vampirizm>rand(max) || player.vampirizm>=max){
        power=Math.floor(player.vampirizm/zn_vamp)+1;

        izm_zdorovie(-player.vampirizm,enemy);
        izm_zdorovie(power,player);

        message_for_pl("Сработал вампиризм! Здоровье -" +player.vampirizm +". Враг восстановился на +" + power,enemy);        
    }
    else {
        //Атака
        power=player.power;
        //Крит!
        max=poisk_min(player.critcanse,enemy.critcanse)+1;
        max*=stepen_crita;
        if (player.critcanse>rand(max) || player.critcanse>=max){
            power*=zn_crita;
            power=Math.floor(power);
            mess+="Крит! "
        }

        //защита
        defen=enemy.defen;

        //Ловкость
        max=poisk_min(player.agility,enemy.agility)+1;
        max*=stepen_uklona;
        if (enemy.agility>rand(max) || enemy.agility>=max){
         mess+="Успешное уклонение!"
        }
        else{
            zn_ataki=defen-power;
            if (zn_ataki<0){
                izm_zdorovie(zn_ataki,enemy);
                mess+="Атака на "+ zn_ataki + " к очкам зрововья";
            }
            else {
            mess+="Атака не прошла защиту";
            }
        }
        message_for_pl(mess, enemy);
    }
}

function ataka_monstr(player,monstr){
    power=player.power;
    defen=monstr.defen;
    zn_ataki_player=defen-power;

    power=monstr.power;
    defen=player.defen;
    zn_ataki_monstr=defen-power;

    text_mess="";
    if (zn_ataki_player<0){
        izm_zdorovie(zn_ataki,enemy);
        message_for_pl("Атака на "+ zn_ataki + " к очкам зрововья", enemy);
    }
    else {
        message_for_pl("Атака не прошла защиту", enemy);
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

function Are_they_alive(player, pc){

    if (!player.isAlife() && pc.isAlife()){
        message_for_pl("Увы! Мертв!", player);
        alert("Игрок проиграл");
        return false;
    }
    else if (player.isAlife() && !pc.isAlife()){
        message_for_pl("Увы! Мертв!", pc);
        alert("Компьютер проиграл");
        return false;
    }
    else if (!player.isAlife() && !pc.isAlife()){
        message_for_pl("Увы! Мертв!", player);
        message_for_pl("Увы! Мертв!", pc);
        alert("Ничья");
        return false;
    }
    return true;
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

function message_for_pl(mess, player){
    player.info[player.info.length]="<b>"+mess+"</b>";
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

step = 0;
var p1,p2;

class Player{
    constructor(n, h, pow, defen, agility, critcanse, immunitet, vamp) {
        this.name = n;
        this.healh = h;
        this.power = pow;
        this.defen = defen;
        this.agility = agility;
        this.critcanse = critcanse;
        this.immunitet = immunitet;
        this.vampirizm = vamp;

        if (n=="игрок"){
            this.x=1;
            this.y=1;
        }
        else {
            this.x=8;
            this.y=8;
        }


        this.lacky = new Map();
        this.info = [];

    }

    isAlife() {
        return this.healh > 0;
    }

    has_immunitet() {
        return this.immunitet > 0;
    }

    str() {

        let parrametri = "<b>Здоровье: </b>" + this.healh + "<br>" +
            "<b>Атака: </b>" + this.power + "<br>" +
            "<b>Защита: </b>" + this.defen + "<br>" +
            "<b>Ловкость: </b>" + this.agility + "<br>" +
            "<b>Шанс Крита: </b>" + this.critcanse + "<br>" +
            "<b>Иммунитет: </b>" + this.immunitet + "<br>" +
            "<b>Вампиризм: </b>" + this.vampirizm + "<br>"
            ;

        if (this.lacky.size > 0) {
            for (let x of this.lacky) {
                parrametri += "<br>";
                parrametri += "<b>" + x[0] + "</b>";
                if (x[1] > 0) {
                    parrametri += ", " + x[1];
                }
            }
        }


        return parrametri;
    }

    str_info() {

        let info_str = "";

        if (this.info.length > 0) {
            for (let x of this.info) {
                info_str += "<br>";
                info_str += x;
            }
        }


        return info_str;
    }

    sayHi() {
        alert(this.name + " готов(а) к битве и передает привет своим поклонникам!");
    }
}


