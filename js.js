function nextstep(direction)
{
    $("#pl_info_battle").hide();
    $("#pc_info_battle").hide();
    $("#pl_info_battle_monstr").hide();
    $("#pc_info_battle_monstr").hide();

    step++; 

    document.getElementById("step_nom").innerHTML=step;

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

    p1.chistka();
    p2.chistka();

    //начало хода
    first_step(p1);
    first_step(p2);

    //Проверка живы ли
    if (!Are_they_alive(p1, p2)){
        document.getElementById("contbutton").setAttribute("class","contbutton_hide");
        document.getElementById("Button_NG").removeAttribute("hidden");
        gameover=true;
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
            gameover=true;
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
            
        case "озеро возрождения":
            full_healh(player);
            //убрать все негативные??
            message_for_pl("Окунулся в озеро возрождения. Здоровье полностью восстановлено",player);
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
            
        case "добрые вампиры":
            zn=5;
            player.vampirizm+=5;
            message_for_pl("Торговцы оказались дружелюбными вампирами! Вампиризм "+odd_or_not(zn)+zn,player);      
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

        //Враги
        case "Змий":
            rnd_zn=rand(step/10)+Math.floor(step/20);
            if(rnd_zn<50) rnd_zn=50;
            healh=rnd_zn;
            rnd_zn=Math.floor(rnd_zn/10);
            enemy = new Player("Змий", healh, rand(rnd_zn)+5, rand(rnd_zn)+5, rand(rnd_zn)+15, rand(rnd_zn)+5, 0, rand(rnd_zn)+5);
            Battle(player,enemy);
            break;

        case "Гриб-убийца":
            rnd_zn=rand(step/10)+Math.floor(step/20);
            if(rnd_zn<50) rnd_zn=50;
            healh=rnd_zn;
            rnd_zn=Math.floor(rnd_zn/10);
            enemy = new Player("Гриб-убийца", healh, rand(rnd_zn)+10, rand(rnd_zn)+10, rand(rnd_zn)+10, rand(rnd_zn)+10, 0, rand(rnd_zn)+5);
            Battle(player,enemy);
            break;
    }


    draw_on_pole(player.x,player.y,);
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

    switch(rand(5)){
  
        case 0:
            //Атака
            player.power+=zn;
            hka="Атака +";     
            break;   
        case 1:
            //Защита
            player.defen+=zn;
            hka="Защита +";    
            break;    
        case 2:
            //Ловкость
            player.agility+=zn;
            hka="Ловкость +";       
            break; 
        case 3:
            //Шанс крита
            player.critcanse+=zn;
            hka="Шанс крита +";    
            break;    
        case 4:
            //Вампиризм
            player.vampirizm+=zn;
            hka="Вампиризм +";
            break;        

    }
    switch(tipe){
        case "линчжи":
            mess= "Вот это удача! Попался линчжи! "
            break;      
        case "золотое яблоко":
            mess= "Вот это удача! Попалось золотое яблоко! "
            break;          
        case "вино":
            mess= "Прекрасное вино! "
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

//настройка шансов
var обычный = 50;
var редкий = 200;
var уникальный = 1000;
var легендарный = 5000;
var мифический = 10000;

function lacky_chance(){

    //обычные
    if (rand(обычный)<1){
        return "болото";
    }
    if (rand(обычный)<1){
        return "мухоморы";
    }
    if (rand(обычный)<1){
        return "ловушка";
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
    if (rand(обычный)<1){
        return "змейка";
    }

    //редкие
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
    if (rand(редкий)<1){
        return "Змий";
    }
    if (rand(редкий)<1){
        return "Гриб-убийца";
    }
    if (rand(редкий)<1){
        return "добрые вампиры";
    }

    //уникальные
    if (rand(уникальный)<1){
        return "метеорит";
    }
    if (rand(уникальный)<1){
        return "золотое яблоко";
    }
    if (rand(уникальный)<1){
        return "червивое яблоко";
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
    if (rand(легендарный)<1){
        return "озеро возрождения";
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

var тестовый = "Змий";
var тестовый2 = "озеро возрождения";

function what_it_is(what){
    switch(what){
        case "игрок":
            return "<img src='img/человечек.png'>";
        
        case "компьютер":
            return "<img src='img/компьютер.png'>";
       
        case "аптечка":
            return "<img src='img/травка.png' "+
            "title='Редкий&#010; " +
            "Лекарственная трава + к Здоровью'>";

        case "ядовитая трава":
        case "травка":
        case "дорогое вино":
        case "добрые вампиры":
            return "<img src='img/торговец.png' "+
            "title='"+
            "Обычный&#010;"+
            " Трава +"+zn_travki+" к Иммунитету"+
            "&#010;Редкий&#010;"+
            " Ядовитая трава - к случайной характерстике"+
            " Добрые вампиры +5 к Вампиризму"+
            "&#010;Уникальный&#010;"+
            " Дорогое вино + к случайной характерстике, снятие эффекта кислоты"+
            "'>";


        case "змейка":
        case "Змий":
            return "<img src='img/змейка.png' "+
            "title='"+
            "Обычный&#010;"+
            " Змейка - к Здоровью, наложение эффекта яда&#010;"+
            "Враг&#010;"+
            " Змий &#010;"+
            "  Здоровье 50+ &#010;"+
            "  Х-ки 5+, скорость 15+ &#010;"+
            "'>";       
            
        case "болото":        
        case "ядовитое болото":
        case "кислотная лужа":
        case "кислотное болото":
        case "озеро возрождения":
            return "<img src='img/лужа.png' "+
            "title='"+
            "Обычный&#010;"+
            " Болото наложение эффекта неподвижности &#010;"+
            "Редкий&#010;"+
            " Кислотная лужа - к Здоровью, наложение эффекта кислоты&#010;"+
            " Ядовитое болото наложение эффектов неподвижности и яда&#010;"+
            "Легендарный&#010;"+
            " Кислотное болото наложение эффектов неподвижности и кислоты&#010;"+
            " Озеро возрождения восстановление здоровья до максимального"+
            "'>";      
            
        case "ловушка":
        case "мина":        
        case "колючая проволока":
            return "<img src='img/ловушка.png' "+
            "title='"+
            "Обычный&#010;"+
            " Ловушка - к Здоровью &#010;"+
            "Редкий&#010;"+
            " Колючая проволока - к Здоровью, наложение эффекта кровотечения&#010;"+
            "Уникальный&#010;"+
            " Мина  - к Здоровью, наложение эффекта кровотечения, имеет шанс смертельного исхода&#010;"+
            "'>"; 

        case "мухоморы":
        case "линчжи":
        case "Гриб-убийца":
            return "<img src='img/гриб.png' "+
            "title='"+
            "Обычный&#010;"+
            " Мухомор - к Здоровью, наложение эффекта отравления &#010;"+
            "Редкий&#010;"+
            " Линчжи + к случайной характеристике&#010;"+
            "Враг&#010;"+
            " Гриб-убийца &#010;"+
            "  Здоровье 50+ &#010;"+
            "  Х-ки 10+, вампиризм 5+ &#010;"+
            "'>"; 

        case "золотое яблоко":
        case "яблоко":
        case "гнилое яблоко": 
        case "червивое яблоко":
            return "<img src='img/яблоко.png' "+
            "title='"+
            "Обычный&#010;"+
            " Яблоко +"+ zn_apple+" к Здоровью &#010;"+
            "Редкий&#010;"+
            " Гнилое яблоко - к Здоровью, наложение эффекта отравления&#010;"+
            "Уникальный&#010;"+
            " Червивое яблоко  - к случайной характерстике&#010;"+
            " Золотое яблоко  + к случайной характерстике&#010;"+
            "'>"; 

        case "единичка к статам":
            return "<img src='img/пять.png' "+
            "title='"+
            "Редкий&#010;"+
            " +5 к случайной характерстике"+
            "'>"; 

        case "пластырь":
            return "<img src='img/пластырь.png' "+
            "title='"+
            "Редкий&#010;"+
            " + к Здоровью, снятие эффекта кровотечения"+
            "'>"; 

        case "вино":
        case "винишко":
            return "<img src='img/вино.png' "+
            "title='"+
            "Обычный&#010;"+
            " Винишко наложение эффекта опьянения &#010;"+
            "Редкий&#010;"+
            " Вино + к случайной характеристике&#010;"+
            "'>"; 
        
        case "щит Эгиды":
        case "меч Всевластия":
            return "<img src='img/сундук.png' "+
            "title='"+
            "Мифический&#010;"+
            " меч Всевластия +100 к атаке &#010;"+
            " щит Эгиды +100 к защите &#010;"+
            "'>"; 

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

function Battle0(){
    message_for_pl("Встреча с компьютером!", p1);
    message_for_pl("Встреча с игроком!", p2);
    for (i=0;i<10;i++){
        ataka0(p1,p2);
        ataka0(p2,p1);
        if (Are_they_alive(p1,p2)){
            if (i<9){
                continue;
            }
            else {
                battle_message_for_pl("Враг сбежал", p1);
                battle_itog(p1);
                battle_itog(p2);
                vivod_battle(p1);
                vivod_battle(p2);
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
            gameover=true;
            break;
        }
   }
}

function Battle(player, enemy){
    message_for_pl("Встреча с врагом! <br><br>" + enemy.name, player);
    message_for_pl(enemy.str(), player);
    hod=0;
    while(true){
        hod++;
        if(hod<=100){
            ataka0(player,enemy);
            ataka0(enemy,player);
            if(!enemy.isAlife()){
                if (player.isAlife()){
                    battle_itog_monstr(player);
                    vivod_battle_monstr(player);
                    delete enemy;
                    break;
                }
            }
            if(!player.isAlife()){
                document.getElementById("contbutton").setAttribute("class","contbutton_hide");
                document.getElementById("Button_NG").removeAttribute("hidden");
                battle_itog_monstr(player);
                vivod_battle_monstr(player);
                gameover=true;
                break;    
            }
        }
        else {
            battle_message_for_pl("Враг сбежал", player);
            battle_itog_monstr(player);
            vivod_battle_monstr(player);
            delete enemy;
            break;
        }
        
    }
   
}

function battle_itog(player){
    
    player.rez_battle_info[player.rez_battle_info.length]="Итоговый урон: " + (player.rez_battle.get("урон")-player.rez_battle.get("вампиризмУ"));
    // if (player.rez_battle.get("вампиризмУ")>0){
    //     player.rez_battle_info[player.rez_battle_info.length]="Нанесено вампиризмом: " + player.rez_battle.get("вампиризмУ");
    // }
    if (player.rez_battle.get("вампиризмЗ")>0){
        player.rez_battle_info[player.rez_battle_info.length]="Восстановлено вампиризмом: " + player.rez_battle.get("вампиризмЗ");
    }
    message_for_pl(
        "<div onclick='showblock(\""+player.name+"\",0);' class='pointer_class'> &#010;"+
        player.str_rez_battle_info() + 
        "</div>"
        ,player
    );
}

function battle_itog_monstr(player){
    
    player.rez_battle_info[player.rez_battle_info.length]="Итоговый урон: " + (player.rez_battle.get("урон")-player.rez_battle.get("вампиризмУ"));
    // if (player.rez_battle.get("вампиризмУ")>0){
    //     player.rez_battle_info[player.rez_battle_info.length]="Нанесено вампиризмом: " + player.rez_battle.get("вампиризмУ");
    // }
    if (player.rez_battle.get("вампиризмЗ")>0){
        player.rez_battle_info[player.rez_battle_info.length]="Восстановлено вампиризмом: " + player.rez_battle.get("вампиризмЗ");
    }
    message_for_pl(
        "<div onclick='showblock(\""+player.name+"\",1);' class='pointer_class'> &#010;"+
        player.str_rez_battle_info() + 
        "</div>"
        ,player
    );
}

//для боя
var stepen_crita=10;
var zn_crita=1.5;
var stepen_uklona=10;
var stepen_vamp=100;
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

        enemy.rez_battle.set("вампиризмУ", enemy.rez_battle.get("вампиризмУ")+player.vampirizm);
        player.rez_battle.set("вампиризмЗ", player.rez_battle.get("вампиризмЗ")+power);

        battle_message_for_pl("Сработал вампиризм! Здоровье -" +player.vampirizm +". Враг восстановился на +" + power,enemy);        
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
            mess+="Крит! ";
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
                enemy.rez_battle.set("урон", enemy.rez_battle.get("урон")+zn_ataki);        
            }
            else {
            mess+="Атака не прошла защиту";
            }
        }
        battle_message_for_pl(mess, enemy);
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

function message_for_pl(mess, player){
    player.info[player.info.length]="<b>"+mess+"</b>";
}

function battle_message_for_pl(mess, player){
    player.battle_info[player.battle_info.length]="<b>"+mess+"</b>";
}

function vivod_battle(player){
    if (player.name=="игрок"){
        document.getElementById("pl_info_battle").innerHTML=p1.str_battle_info();
    }
    if (player.name=="компьютер"){
        document.getElementById("pc_info_battle").innerHTML=p2.str_battle_info();
    }
}

function vivod_battle_monstr(player){

    if (player.name=="игрок"){
        document.getElementById("pl_info_battle_monstr").innerHTML=p1.str_battle_info();
    }
    if (player.name=="компьютер"){
        document.getElementById("pc_info_battle_monstr").innerHTML=p2.str_battle_info();
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

        this.max_health = h;

        if (n=="игрок"){
            this.x=1;
            this.y=1;
        }
        else if (n=="компьютер"){
            this.x=8;
            this.y=8;
        }


        this.lacky = new Map();
        this.rez_battle = new Map([
            ["урон", 0],
            ["вампиризмУ", 0],
            ["вампиризмЗ", 0],
            ["уклонение",  0]
          ]);
        this.info = [];
        this.rez_battle_info = [];
        this.battle_info = [];

    }

    chistka(){
        this.info = [];
        this.rez_battle_info = [];
        this.battle_info = [];
        this.rez_battle.set("урон", 0);
        this.rez_battle.set("вампиризмУ", 0);
        this.rez_battle.set("вампиризмЗ", 0);
        this.rez_battle.set("уклонение", 0);
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

    str_rez_battle_info() {

        let info_str = "";

        if (this.rez_battle_info.length > 0) {
            for (let x of this.rez_battle_info) {
                info_str += x;
                info_str += "<br>";
            }
        }


        return info_str;
    }

    str_battle_info() {

        let info_str = "";

        if (this.battle_info.length > 0) {
            for (let x of this.battle_info) {
                info_str += x;   
                info_str += "<br>";             
            }
        }


        return info_str;
    }

    sayHi() {
        alert(this.name + " готов(а) к битве и передает привет своим поклонникам!");
    }
}


